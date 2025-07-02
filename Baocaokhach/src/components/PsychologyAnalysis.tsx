/**
 * Component phân tích tâm lý khách hàng
 * Bao gồm chọn khách hàng, phân tích tâm lý, điểm mạnh/yếu, tình hình tài chính
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Brain, 
  Heart, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Users,
  Zap,
  Shield,
  Save,
  Eye,
  CheckCircle,
  User,
  FileText,
  MessageSquare,
  TrendingDown,
  Phone,
  Calendar,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getValidSelectValue } from '../utils/selectFixer';

/**
 * Interface cho dữ liệu phân tích tâm lý
 */
interface PsychologyData {
  customerId: string;
  personalityType: string;
  motivations: string;
  fears: string;
  strengths: string;
  weaknesses: string;
  approach: string;
  income: string;
  incomeSource: string;
  assets: string;
  debts: string;
  investmentCapacity: string;
  whatWeToldThem: string;
  analysisResult: string;
  recommendations: string;
  lastUpdated: string;
}

export default function PsychologyAnalysis() {
  const { currentUser } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [psychologyData, setPsychologyData] = useState<PsychologyData>({
    customerId: '',
    personalityType: '',
    motivations: '',
    fears: '',
    strengths: '',
    weaknesses: '',
    approach: '',
    income: '',
    incomeSource: '',
    assets: '',
    debts: '',
    investmentCapacity: '',
    whatWeToldThem: '',
    analysisResult: '',
    recommendations: '',
    lastUpdated: ''
  });
  const [savedData, setSavedData] = useState<Record<string, PsychologyData>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Load danh sách khách hàng khi component mount
   */
  useEffect(() => {
    if (currentUser) {
      const customerData = localStorage.getItem(`customers_${currentUser.id}`);
      if (customerData) {
        setCustomers(JSON.parse(customerData));
      }
    }
  }, [currentUser]);

  /**
   * Load dữ liệu phân tích đã lưu
   */
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`psychology_${currentUser.id}`);
      if (saved) {
        setSavedData(JSON.parse(saved));
      }
    }
  }, [currentUser]);

  /**
   * Load dữ liệu của khách hàng được chọn
   */
  useEffect(() => {
    if (selectedCustomer) {
      const existingData = savedData[selectedCustomer.id];
      if (existingData) {
        setPsychologyData(existingData);
      } else {
        setPsychologyData({
          customerId: selectedCustomer.id,
          personalityType: '',
          motivations: '',
          fears: '',
          strengths: '',
          weaknesses: '',
          approach: '',
          income: '',
          incomeSource: '',
          assets: '',
          debts: '',
          investmentCapacity: '',
          whatWeToldThem: '',
          analysisResult: '',
          recommendations: '',
          lastUpdated: ''
        });
      }
    }
  }, [selectedCustomer, savedData]);

  /**
   * Xử lý chọn khách hàng
   */
  const handleSelectCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer);
  };

  /**
   * Cập nhật dữ liệu phân tích
   */
  const updateData = (field: keyof PsychologyData, value: string) => {
    setPsychologyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Lưu dữ liệu phân tích
   */
  const saveAnalysis = () => {
    if (!selectedCustomer || !currentUser) return;

    const updatedData = {
      ...psychologyData,
      lastUpdated: new Date().toISOString()
    };

    const newSavedData = {
      ...savedData,
      [selectedCustomer.id]: updatedData
    };

    setSavedData(newSavedData);
    localStorage.setItem(`psychology_${currentUser.id}`, JSON.stringify(newSavedData));
    setPsychologyData(updatedData);

    // Hiển thị thông báo thành công
    alert('Đã lưu phân tích thành công!');
  };

  /**
   * Phân tích tự động dựa trên dữ liệu có sẵn
   */
  const autoAnalyze = () => {
    if (!selectedCustomer || !currentUser) return;

    setIsAnalyzing(true);

    // Lấy dữ liệu 7 ngày từ localStorage
    const formData = localStorage.getItem('customerFormData');
    const summaryData = localStorage.getItem(`customerSummary_${selectedCustomer.id}`);
    
    let analysisResult = '';
    let recommendations = '';

    // Phân tích từ summary data
    if (summaryData) {
      const summary = JSON.parse(summaryData);
      
      analysisResult += `**📊 PHÂN TÍCH TÂM LÝ KHÁCH HÀNG: ${selectedCustomer.name}**\n\n`;
      
      if (summary.personalityType) {
        const personalityText = summary.personalityType === 'emotional' ? 'Người sống tình cảm' :
                               summary.personalityType === 'practical' ? 'Người thực tế' : 'Cân bằng';
        analysisResult += `🧠 **Loại tính cách:** ${personalityText}\n`;
        
        if (summary.personalityType === 'emotional') {
          recommendations += '• Sử dụng câu chuyện cảm động, chia sẻ trải nghiệm thực tế\n';
          recommendations += '• Nhấn mạnh về gia đình, tương lai con cái\n';
          recommendations += '• Tạo kết nối cảm xúc trước khi bàn về lợi ích\n';
        } else if (summary.personalityType === 'practical') {
          recommendations += '• Đưa ra số liệu cụ thể, bằng chứng ROI rõ ràng\n';
          recommendations += '• So sánh với các kênh đầu tư khác\n';
          recommendations += '• Tập trung vào lợi ích thiết thực\n';
        }
      }
      
      if (summary.dreams) {
        analysisResult += `🎯 **Ước mơ/Động lực:** ${summary.dreams}\n`;
        recommendations += '• Liên kết sản phẩm với ước mơ của khách hàng\n';
      }
      
      if (summary.saddestPast) {
        analysisResult += `😔 **Nỗi đau quá khứ:** ${summary.saddestPast}\n`;
        recommendations += '• Thấu hiểu và chia sẻ cùng cảm xúc\n';
        recommendations += '• Đưa ra giải pháp tránh lặp lại sai lầm\n';
      }

      if (summary.strengths) {
        analysisResult += `💪 **Điểm mạnh:** ${summary.strengths}\n`;
      }

      if (summary.weaknesses) {
        analysisResult += `⚠️ **Điểm yếu:** ${summary.weaknesses}\n`;
      }
    }

    // Phân tích từ form data 7 ngày
    if (formData) {
      const allFormData = JSON.parse(formData);
      const customerFormData = allFormData[selectedCustomer.id] || {};
      
      analysisResult += `\n**📝 PHÂN TÍCH TỪ QUÁ TRÌNH NURTURE 7 NGÀY:**\n\n`;

      // Phân tích thu nhập từ ngày 2
      const day2Answers = Object.keys(customerFormData)
        .filter(key => key.startsWith('day_2_'))
        .map(key => customerFormData[key])
        .filter(answer => answer && answer.trim());

      if (day2Answers.length > 0) {
        analysisResult += `💰 **Tình hình tài chính:**\n`;
        day2Answers.forEach((answer, index) => {
          analysisResult += `- ${answer}\n`;
        });
        
        if (day2Answers.some(answer => answer.toLowerCase().includes('nợ'))) {
          analysisResult += `⚠️ **Áp lực tài chính:** Có dấu hiệu nợ nần, cần tiếp cận cẩn trọng\n`;
          recommendations += '• Đề xuất gói đầu tư nhỏ, ít rủi ro\n';
          recommendations += '• Nhấn mạnh về tính ổn định và bảo toàn vốn\n';
        }
      }

      // Phân tích mối quan hệ từ ngày 6
      const day6Answers = Object.keys(customerFormData)
        .filter(key => key.startsWith('day_6_'))
        .map(key => customerFormData[key])
        .filter(answer => answer && answer.trim());

      if (day6Answers.length > 0) {
        analysisResult += `\n💕 **Quan điểm về tình yêu & mối quan hệ:**\n`;
        if (day6Answers.some(answer => answer.toLowerCase().includes('độc thân'))) {
          analysisResult += `- Hiện tại độc thân, có thể tập trung vào phát triển bản thân\n`;
          recommendations += '• Nhấn mạnh về tự do tài chính và độc lập\n';
        }
      }

      // Phân tích dự định tương lai từ ngày 7
      const day7Answers = Object.keys(customerFormData)
        .filter(key => key.startsWith('day_7_'))
        .map(key => customerFormData[key])
        .filter(answer => answer && answer.trim());

      if (day7Answers.length > 0) {
        analysisResult += `\n🚀 **Dự định tương lai:**\n`;
        day7Answers.forEach((answer, index) => {
          if (answer.toLowerCase().includes('đầu tư')) {
            analysisResult += `- Có ý định đầu tư: ${answer}\n`;
            recommendations += '• Khách hàng đã sẵn sàng đầu tư, tiếp cận tích cực\n';
          }
        });
      }

      // Tính mức độ tương tác
      const totalAnswers = Object.values(customerFormData).filter(answer => answer && answer.trim()).length;
      const totalQuestions = 7 * 9; // 7 ngày x 9 câu hỏi
      const interactionRate = (totalAnswers / totalQuestions) * 100;

      analysisResult += `\n📊 **Mức độ tương tác:** ${interactionRate.toFixed(1)}% (${totalAnswers}/${totalQuestions} câu trả lời)\n`;
      
      if (interactionRate > 70) {
        recommendations += '• Khách hàng rất tích cực, có thể closing sớm\n';
      } else if (interactionRate > 40) {
        recommendations += '• Khách hàng khá quan tâm, cần nurture thêm\n';
      } else {
        recommendations += '• Khách hàng ít tương tác, cần thay đổi chiến lược\n';
      }
    }

    // Gợi ý chiến lược tổng thể
    analysisResult += `\n**🎯 ĐÁNH GIÁ TỔNG THỂ:**\n`;
    if (selectedCustomer.totalProgress > 80) {
      analysisResult += `- Tiến độ nurture rất tốt (${selectedCustomer.totalProgress.toFixed(1)}%)\n`;
      recommendations += '• Khách hàng đã sẵn sàng, nên chốt sale trong vài ngày tới\n';
    } else if (selectedCustomer.totalProgress > 50) {
      analysisResult += `- Tiến độ nurture khá (${selectedCustomer.totalProgress.toFixed(1)}%)\n`;
      recommendations += '• Cần nurture thêm 1-2 tuần nữa\n';
    } else {
      analysisResult += `- Tiến độ nurture chậm (${selectedCustomer.totalProgress.toFixed(1)}%)\n`;
      recommendations += '• Cần xem xét lại chiến lược nurture\n';
    }

    // Cập nhật state
    setPsychologyData(prev => ({
      ...prev,
      analysisResult,
      recommendations
    }));

    setIsAnalyzing(false);
    alert('Đã phân tích tự động thành công!');
  };

  /**
   * Kiểm tra khách hàng đã được phân tích chưa
   */
  const isAnalyzed = (customerId: string) => {
    return savedData[customerId] && savedData[customerId].lastUpdated;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-800">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              Phân Tích Tâm Lý Khách Hàng
            </CardTitle>
            <p className="text-sm text-gray-600">Phân tích tâm lý, điểm mạnh, điểm yếu và tình hình tài chính của khách hàng</p>
          </CardHeader>
        </Card>

        {/* 1️⃣ Phần Chọn Khách Hàng */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              1️⃣ Chọn Khách Hàng Để Phân Tích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleSelectCustomer}>
              <SelectTrigger className="h-12 bg-gray-50/50 border-0 focus:bg-white transition-colors">
                <SelectValue placeholder="-- Chọn khách hàng cần phân tích --" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                            <Calendar className="w-3 h-3 ml-2" />
                            Ngày {customer.currentDay || 0}/7
                          </div>
                        </div>
                      </div>
                      {isAnalyzed(customer.id) && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCustomer && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900">{selectedCustomer.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-blue-700">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {selectedCustomer.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Ngày {selectedCustomer.currentDay || 0}/7
                      </span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {selectedCustomer.totalProgress.toFixed(0)}% hoàn thành
                      </Badge>
                    </div>
                    {isAnalyzed(selectedCustomer.id) && (
                      <Badge className="bg-green-100 text-green-800 mt-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã được phân tích
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedCustomer && (
          <>
            {/* 2️⃣ Các Mục Phân Tích Tâm Lý */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  2️⃣ Phân Tích Tâm Lý
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      Loại tính cách:
                    </label>
                    <Select value={getValidSelectValue(psychologyData.personalityType, '')} onValueChange={(value) => updateData('personalityType', value)}>
                      <SelectTrigger className="h-10 bg-gray-50/50 border-0 focus:bg-white">
                        <SelectValue placeholder="Chọn loại tính cách" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emotional">💖 Người sống tình cảm</SelectItem>
                        <SelectItem value="practical">🎯 Người thực tế</SelectItem>
                        <SelectItem value="mixed">⚖️ Cân bằng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-600" />
                      Động lực chính:
                    </label>
                    <Textarea 
                      placeholder="VD: Muốn có tiền mua nhà, lo cho gia đình..."
                      value={psychologyData.motivations}
                      onChange={(e) => updateData('motivations', e.target.value)}
                      className="h-20 bg-gray-50/50 border-0 focus:bg-white resize-none"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Nỗi sợ/Lo lắng:
                    </label>
                    <Textarea 
                      placeholder="VD: Sợ mất tiền, sợ bị lừa..."
                      value={psychologyData.fears}
                      onChange={(e) => updateData('fears', e.target.value)}
                      className="h-20 bg-gray-50/50 border-0 focus:bg-white resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3️⃣ Phân Tích Điểm Yếu & Điểm Mạnh */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  3️⃣ Phân Tích Điểm Mạnh & Điểm Yếu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-green-700 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Điểm mạnh của khách:
                    </label>
                    <Textarea 
                      placeholder="VD: Có kinh nghiệm đầu tư, thông minh, có network..."
                      value={psychologyData.strengths}
                      onChange={(e) => updateData('strengths', e.target.value)}
                      className="h-24 bg-gray-50/50 border-0 focus:bg-white resize-none"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-red-700 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Điểm yếu có thể khai thác:
                    </label>
                    <Textarea 
                      placeholder="VD: Dễ tin người, ít hiểu biết công nghệ, vội vàng..."
                      value={psychologyData.weaknesses}
                      onChange={(e) => updateData('weaknesses', e.target.value)}
                      className="h-24 bg-gray-50/50 border-0 focus:bg-white resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4️⃣ Tình Hình Kinh Tế & Tài Chính */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  4️⃣ Tình Hình Kinh Tế & Tài Chính
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700">Thu nhập ước tính:</label>
                    <Input 
                      placeholder="VD: 15-20 triệu/tháng"
                      value={psychologyData.income}
                      onChange={(e) => updateData('income', e.target.value)}
                      className="h-10 bg-gray-50/50 border-0 focus:bg-white"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700">Nguồn thu nhập:</label>
                    <Input 
                      placeholder="VD: Kinh doanh, lương công ty, đầu tư..."
                      value={psychologyData.incomeSource}
                      onChange={(e) => updateData('incomeSource', e.target.value)}
                      className="h-10 bg-gray-50/50 border-0 focus:bg-white"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700">Tài sản hiện có:</label>
                    <Textarea 
                      placeholder="VD: Nhà 3 tỷ, xe 800tr, tiết kiệm 500tr..."
                      value={psychologyData.assets}
                      onChange={(e) => updateData('assets', e.target.value)}
                      className="h-20 bg-gray-50/50 border-0 focus:bg-white resize-none"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700">Nợ/Cam kết tài chính:</label>
                    <Textarea 
                      placeholder="VD: Vay ngân hàng 500tr, nợ thẻ tín dụng 50tr..."
                      value={psychologyData.debts}
                      onChange={(e) => updateData('debts', e.target.value)}
                      className="h-20 bg-gray-50/50 border-0 focus:bg-white resize-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Khả năng đầu tư ước tính:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Dưới 50 triệu', '50-200 triệu', '200-500 triệu', 'Trên 500 triệu'].map(range => (
                      <Button
                        key={range}
                        variant={psychologyData.investmentCapacity === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateData('investmentCapacity', range)}
                        className="text-xs h-9"
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5️⃣ Mình đã nói và chia sẻ gì với khách */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  5️⃣ Mình Đã Nói & Chia Sẻ Gì Với Khách
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">
                    Những thông tin, câu chuyện, kinh nghiệm đã chia sẻ:
                  </label>
                  <Textarea 
                    placeholder="VD: Đã kể về case study thành công của khách hàng khác, chia sẻ về xu hướng thị trường, giải thích về rủi ro và cơ hội..."
                    value={psychologyData.whatWeToldThem}
                    onChange={(e) => updateData('whatWeToldThem', e.target.value)}
                    className="min-h-[120px] bg-gray-50/50 border-0 focus:bg-white resize-none"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={saveAnalysis} 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Lưu Phân Tích
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={autoAnalyze} 
                    disabled={isAnalyzing}
                    className="flex-1 h-12 hover:bg-purple-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        Đang phân tích...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Phân Tích Tự Động
                      </>
                    )}
                  </Button>
                  
                  {psychologyData.lastUpdated && (
                    <div className="flex items-center text-xs text-gray-500 px-3 justify-center sm:justify-start">
                      <Calendar className="w-3 h-3 mr-1" />
                      Cập nhật: {new Date(psychologyData.lastUpdated).toLocaleString('vi-VN')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 6️⃣ Kết Quả Phân Tích */}
            {(psychologyData.analysisResult || psychologyData.recommendations) && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    6️⃣ Kết Quả Phân Tích & Hướng Dẫn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Kết quả phân tích */}
                    {psychologyData.analysisResult && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-indigo-600" />
                          Báo Cáo Phân Tích Chi Tiết
                        </h4>
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 font-mono">
                            {psychologyData.analysisResult}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Khuyến nghị hành động */}
                    {psychologyData.recommendations && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          <Target className="w-5 h-5 text-green-600" />
                          Khuyến Nghị Hành Động
                        </h4>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                            {psychologyData.recommendations}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Thống kê tổng quan */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalProgress.toFixed(0)}%</div>
                        <div className="text-sm text-blue-700">Tiến độ nurture</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedCustomer.currentDay || 0}/7
                        </div>
                        <div className="text-sm text-green-700">Ngày hiện tại</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedCustomer.completedDays?.length || 0}
                        </div>
                        <div className="text-sm text-purple-700">Ngày hoàn thành</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* No Customer Selected State */}
        {!selectedCustomer && (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="relative">
                <Brain className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 blur-2xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Chọn Khách Hàng Để Bắt Đầu Phân Tích
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Vui lòng chọn khách hàng từ dropdown ở trên để bắt đầu quá trình phân tích tâm lý
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
