/**
 * Component form nhập liệu thông tin khách hàng
 * Quản lý việc nhập thông tin theo từng ngày
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Save, 
  CheckCircle, 
  User, 
  Calendar,
  ArrowLeft,
  ArrowRight,
  Target,
  AlertCircle,
  FileText,
  Clock,
  Edit3,
  BookOpen
} from 'lucide-react';
import CustomerSummary from './CustomerSummary';
import PotentialManagement from './PotentialManagement';
import { getValidSelectValue } from '../utils/selectFixer';

/**
 * Interface cho props của CustomerForm
 */
interface CustomerFormProps {
  customers: any[];
  selectedCustomer: any;
  onUpdateProgress: (customerId: string, day: number, completed: boolean) => void;
  onUpdatePotential?: (customerId: string, isPotential: boolean, score?: number, notes?: string) => void;
  dayPhases: any[];
}

/**
 * Cấu trúc câu hỏi cho từng ngày
 */
const dayQuestions = {
  1: [
    'Tên đầy đủ, năm sinh, tuổi',
    'Quê quán, nơi đang sống hiện tại', 
    'Nghề nghiệp, công việc đang làm',
    'Tình trạng hôn nhân (kết hôn/ly hôn/độc thân, có con không)',
    'Sống một mình hay với gia đình',
    'Mối quan hệ với bố mẹ, anh chị em',
    'Tính cách, mức độ chia sẻ, phản ứng với câu hỏi cá nhân',
    'Giờ sinh hoạt, công việc chính',
    'Gu sống, phong cách sống'
  ],
  2: [
    'Thu nhập ước chừng hàng tháng (đã trừ chi tiêu)',
    'Chi phí sinh hoạt trung bình (ăn uống, chi tiêu)',
    'Cách quản lý chi tiêu (tiết kiệm/hoang phí/mục đích gì)',
    'Áp lực tài chính (nợ, hỗ trợ gia đình)',
    'Lối sống: tiết kiệm hay thoải mái, có tích lũy không',
    'Khi vui/buồn sẽ làm gì, đi đâu',
    'Sở thích, giờ giấc sinh hoạt',
    'Khi nào rảnh rỗi',
    'Quan điểm về công việc hiện tại'
  ],
  3: [
    'Đã từng nghe/biết đến tiền điện tử chưa',
    'Từng đầu tư vào lĩnh vực nào (BDS, chứng khoán, kinh doanh)',
    'Phản ứng khi nhắc đến tiền điện tử',
    'Biết gì về Bitcoin, có tò mò không',
    'Có tài khoản ngân hàng không',
    'Từng thử đầu tư gì chưa',
    'Quan điểm về rủi ro khi đầu tư',
    'Kỷ niệm/câu chuyện liên quan đến tiền điện tử',
    'Mức độ sẵn sàng với công nghệ mới'
  ],
  4: [
    'Kỷ niệm đáng nhớ: vui, buồn, mất mát, tổn thương',
    'Từng bị lừa chưa, theo hình thức nào',
    'Từng vướng nợ hay mất tiền (tại sao, như thế nào)',
    'Gia đình có gặp khó khăn gì không',
    'Biến cố đáng nhớ, trải qua như thế nào',
    'Những tổn thương sâu sắc nhất',
    'Cách vượt qua khó khăn',
    'Bài học từ những lần thất bại',
    'Có ai đó tin tưởng để tâm sự không'
  ],
  5: [
    'Kỳ vọng trong công việc và cuộc sống',
    'Mục tiêu tương lai: nhà, xe, con cái, sự nghiệp',
    'Quan điểm về tiền bạc (thực dụng/cẩn trọng/mạo hiểm)',
    'Kiếm bao nhiêu tiền là đủ',
    'Mong muốn về con cái và cuộc sống sau này',
    'Có muốn sống tự do hơn không',
    'Thu nhập phụ hiện tại',
    'Áp lực về tiền bạc',
    'Ước mơ lớn nhất trong cuộc đời'
  ],
  6: [
    'Mẫu người lý tưởng',
    'Quan điểm về tình yêu và hôn nhân',
    'Đã từng yêu sâu đậm chưa, mối quan hệ gần nhất',
    'Nhạy cảm với điều gì trong mối quan hệ',
    'Gia đình ảnh hưởng gì đến tình yêu',
    'Từng dùng app hẹn hò, ví điện tử nào',
    'Ngân hàng chính đang dùng',
    'Có sẵn sàng thử nghiệm công nghệ mới không',
    'Mức độ tin tưởng vào người khác'
  ],
  7: [
    'Dự định trong 1-3 năm tới (mua nhà, ổn định sự nghiệp)',
    'Mong muốn nâng cao thu nhập/cải thiện chất lượng sống',
    'Sẵn sàng học công nghệ mới hay đầu tư thông minh không',
    'Quan điểm về thay đổi, có ngại rủi ro không',
    'Mong muốn công việc/thu nhập linh hoạt, tự chủ',
    'Sẵn sàng cho cơ hội đầu tư mới không',
    'Mức vốn có thể bỏ ra để thử nghiệm',
    'Người có thể tham khảo khi đưa quyết định tài chính',
    'Định hướng phát triển bản thân'
  ]
};

export default function CustomerForm({ 
  customers, 
  selectedCustomer, 
  onUpdateProgress, 
  onUpdatePotential,
  dayPhases 
}: CustomerFormProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  /**
   * Load dữ liệu form từ localStorage
   */
  useEffect(() => {
    const savedFormData = localStorage.getItem('customerFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  /**
   * Lưu dữ liệu form vào localStorage
   */
  useEffect(() => {
    localStorage.setItem('customerFormData', JSON.stringify(formData));
  }, [formData]);

  /**
   * Set khách hàng được chọn
   */
  useEffect(() => {
    if (selectedCustomer) {
      setSelectedCustomerId(selectedCustomer.id);
      setActiveDay(selectedCustomer.currentDay || 1);
    }
  }, [selectedCustomer]);

  /**
   * Cập nhật dữ liệu form
   */
  const updateFormData = (day: number, questionIndex: number, value: string) => {
    const customerId = selectedCustomerId;
    if (!customerId) return;

    setFormData(prev => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [`day_${day}_q_${questionIndex}`]: value
      }
    }));
  };

  /**
   * Lưu và hoàn thành ngày
   */
  const saveAndCompleteDay = (day: number) => {
    if (!selectedCustomerId) return;

    const dayQuestionsList = dayQuestions[day as keyof typeof dayQuestions] || [];
    const isCompleted = dayQuestionsList.every((_, index) => {
      const key = `day_${day}_q_${index}`;
      const value = formData[selectedCustomerId]?.[key] || '';
      return value.trim().length > 0;
    });

    if (isCompleted) {
      onUpdateProgress(selectedCustomerId, day, true);
      if (day < 7) {
        setActiveDay(day + 1);
      }
    } else {
      alert('Vui lòng điền đầy đủ tất cả các câu hỏi trước khi hoàn thành ngày này!');
    }
  };

  /**
   * Lấy dữ liệu cho câu hỏi cụ thể
   */
  const getQuestionValue = (day: number, questionIndex: number) => {
    if (!selectedCustomerId) return '';
    const key = `day_${day}_q_${questionIndex}`;
    return formData[selectedCustomerId]?.[key] || '';
  };

  /**
   * Kiểm tra ngày đã hoàn thành chưa
   */
  const isDayCompleted = (day: number) => {
    const customer = customers.find(c => c.id === selectedCustomerId);
    return customer?.completedDays?.includes(day) || false;
  };

  /**
   * Tính phần trăm hoàn thành của ngày
   */
  const getDayProgress = (day: number) => {
    if (!selectedCustomerId) return 0;
    
    const dayQuestionsList = dayQuestions[day as keyof typeof dayQuestions] || [];
    const answeredQuestions = dayQuestionsList.filter((_, index) => {
      const key = `day_${day}_q_${index}`;
      const value = formData[selectedCustomerId]?.[key] || '';
      return value.trim().length > 0;
    }).length;
    
    return dayQuestionsList.length > 0 ? (answeredQuestions / dayQuestionsList.length) * 100 : 0;
  };

  if (customers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="relative">
                <User className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 blur-2xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Chưa có khách hàng
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Vui lòng thêm khách hàng trước khi nhập liệu thông tin
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Customer Selection */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              Chọn Khách Hàng Để Nhập Liệu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={getValidSelectValue(selectedCustomerId, 'none')} onValueChange={(value) => setSelectedCustomerId(value === 'none' ? '' : value)}>
              <SelectTrigger className="h-14 text-lg bg-gray-50/50 border-0 focus:bg-white transition-colors">
                <SelectValue placeholder="Chọn khách hàng cần nhập liệu..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Chọn khách hàng...</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        {customer.totalProgress.toFixed(0)}%
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedCustomerId && currentCustomer && (
          <>
            {/* Progress Overview */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">Tiến Độ Tổng Quan</div>
                      <div className="text-sm text-gray-500">{currentCustomer.name}</div>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 border-blue-200 px-4 py-2 text-lg font-semibold">
                    {currentCustomer.totalProgress.toFixed(0)}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-3 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                    const progress = getDayProgress(day);
                    const completed = isDayCompleted(day);
                    
                    return (
                      <div key={day} className="text-center">
                        <Button
                          variant={day === activeDay ? "default" : "outline"}
                          size="lg"
                          className={`w-full h-16 mb-3 transition-all ${
                            completed 
                              ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg scale-105' 
                              : day === activeDay
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg scale-105'
                              : 'hover:bg-gray-50 hover:scale-105'
                          }`}
                          onClick={() => setActiveDay(day)}
                        >
                          <div className="flex flex-col items-center">
                            {completed && <CheckCircle className="w-4 h-4 mb-1" />}
                            <span className="font-bold">Ngày {day}</span>
                          </div>
                        </Button>
                        <div className="text-xs font-semibold text-gray-600">
                          {progress.toFixed(0)}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className={`h-1 rounded-full transition-all ${
                              completed ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Customer Summary */}
            <CustomerSummary 
              customerId={selectedCustomerId}
              customerName={currentCustomer.name}
            />

            {/* Potential Management */}
            {onUpdatePotential && (
              <PotentialManagement
                customer={currentCustomer}
                onUpdatePotential={onUpdatePotential}
              />
            )}

            {/* Day Form */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${dayPhases[activeDay - 1]?.color} text-white shadow-lg`}>
                      {dayPhases[activeDay - 1]?.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        Ngày {activeDay}: {dayPhases[activeDay - 1]?.title}
                      </div>
                      <div className="text-sm text-gray-500 font-normal mt-1">
                        {dayPhases[activeDay - 1]?.description}
                      </div>
                    </div>
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setActiveDay(Math.max(1, activeDay - 1))}
                      disabled={activeDay === 1}
                      className="h-12 px-6 hover:bg-gray-50"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setActiveDay(Math.min(7, activeDay + 1))}
                      disabled={activeDay === 7}
                      className="h-12 px-6 hover:bg-gray-50"
                    >
                      Sau
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-700">Tiến độ ngày {activeDay}</span>
                    <span className="text-lg font-bold text-gray-800">{getDayProgress(activeDay).toFixed(0)}%</span>
                  </div>
                  <Progress value={getDayProgress(activeDay)} className="h-3 bg-gray-200" />
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      {(dayQuestions[activeDay as keyof typeof dayQuestions] || []).length - 
                       (dayQuestions[activeDay as keyof typeof dayQuestions] || []).filter((_, index) => 
                         getQuestionValue(activeDay, index).trim().length > 0
                       ).length} câu hỏi chưa trả lời
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {(dayQuestions[activeDay as keyof typeof dayQuestions] || []).map((question, index) => (
                  <div key={index} className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-3 text-gray-700">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        getQuestionValue(activeDay, index).trim() 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="flex-1">{question}</span>
                      {getQuestionValue(activeDay, index).trim() && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      )}
                    </label>
                    <div className="ml-11">
                      <Textarea
                        placeholder="Nhập thông tin thu thập được từ khách hàng..."
                        value={getQuestionValue(activeDay, index)}
                        onChange={(e) => updateFormData(activeDay, index, e.target.value)}
                        className="min-h-[100px] bg-gray-50/50 border-0 focus:bg-white transition-colors resize-none"
                        rows={4}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">
                      {(dayQuestions[activeDay as keyof typeof dayQuestions] || []).length - 
                       (dayQuestions[activeDay as keyof typeof dayQuestions] || []).filter((_, index) => 
                         getQuestionValue(activeDay, index).trim().length > 0
                       ).length} câu hỏi chưa trả lời
                    </span>
                  </div>
                  
                  <Button 
                    onClick={() => saveAndCompleteDay(activeDay)}
                    disabled={getDayProgress(activeDay) < 100}
                    size="lg"
                    className={`px-8 h-12 font-semibold shadow-lg transition-all ${
                      isDayCompleted(activeDay)
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {isDayCompleted(activeDay) ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Đã hoàn thành
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Hoàn thành ngày {activeDay}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
