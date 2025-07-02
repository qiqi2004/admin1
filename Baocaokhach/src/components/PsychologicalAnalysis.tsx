/**
 * Component phân tích tâm lý khách hàng
 * Phân tích và đưa ra gợi ý chiến lược tiếp cận dựa trên thông tin 7 ngày
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { 
  Brain, 
  Heart, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  MessageCircle,
  User,
  CheckCircle,
  Star,
  DollarSign,
  Clock,
  Lightbulb,
  Shield,
  Zap,
  Users,
  Eye,
  BookOpen,
  Save
} from 'lucide-react';

/**
 * Interface cho dữ liệu phân tích tâm lý
 */
interface PsychologicalProfile {
  customerId: string;
  personalityType: 'emotional' | 'practical' | 'mixed';
  motivationFactors: string[];
  fears: string[];
  approachStrategy: string;
  weaknessToExploit: string;
  salesStrategy: string;
  communicationStyle: string;
  trustBuilding: string;
  analysisNotes: string;
  lastUpdated: string;
}

/**
 * Interface cho props
 */
interface PsychologicalAnalysisProps {
  customers: any[];
  selectedCustomer: any | null;
  onSelectCustomer: (customer: any) => void;
}

export default function PsychologicalAnalysis({ 
  customers, 
  selectedCustomer, 
  onSelectCustomer 
}: PsychologicalAnalysisProps) {
  const [profiles, setProfiles] = useState<Record<string, PsychologicalProfile>>({});
  const [currentProfile, setCurrentProfile] = useState<PsychologicalProfile | null>(null);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);

  /**
   * Load dữ liệu phân tích từ localStorage
   */
  useEffect(() => {
    const savedProfiles = localStorage.getItem('psychologicalProfiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
  }, []);

  /**
   * Load profile của khách hàng được chọn
   */
  useEffect(() => {
    if (selectedCustomer) {
      const profile = profiles[selectedCustomer.id];
      if (profile) {
        setCurrentProfile(profile);
      } else {
        // Tạo profile mới với phân tích tự động
        const autoAnalysis = generateAutoAnalysis(selectedCustomer);
        setCurrentProfile(autoAnalysis);
      }
      setEditingCustomerId(selectedCustomer.id);
    }
  }, [selectedCustomer, profiles]);

  /**
   * Tạo phân tích tự động dựa trên dữ liệu có sẵn
   */
  const generateAutoAnalysis = (customer: any): PsychologicalProfile => {
    const summaryData = localStorage.getItem(`customerSummary_${customer.id}`);
    const formData = localStorage.getItem('customerFormData');
    
    let personalityType: 'emotional' | 'practical' | 'mixed' = 'mixed';
    let motivationFactors: string[] = [];
    let fears: string[] = [];
    let approachStrategy = '';
    let weaknessToExploit = '';
    
    // Phân tích từ summary data
    if (summaryData) {
      const summary = JSON.parse(summaryData);
      personalityType = summary.personalityType || 'mixed';
      
      if (summary.dreams) {
        motivationFactors.push('Có ước mơ rõ ràng', 'Mong muốn thay đổi cuộc sống');
      }
      
      if (summary.saddestPast) {
        fears.push('Sợ lặp lại quá khứ đau buồn', 'Lo lắng về tổn thất tài chính');
      }
    }
    
    // Phân tích từ form data
    if (formData) {
      const allFormData = JSON.parse(formData);
      const customerData = allFormData[customer.id] || {};
      
      // Phân tích thu nhập và tài chính
      const incomeAnswers = Object.keys(customerData)
        .filter(key => key.startsWith('day_2_'))
        .map(key => customerData[key])
        .filter(answer => answer);
        
      if (incomeAnswers.some(answer => answer.toLowerCase().includes('nợ'))) {
        fears.push('Áp lực nợ nần', 'Lo lắng tài chính');
        motivationFactors.push('Muốn thoát khỏi nợ nần');
      }
      
      if (incomeAnswers.some(answer => answer.toLowerCase().includes('tiết kiệm'))) {
        motivationFactors.push('Có thói quen tiết kiệm');
        approachStrategy = 'Tập trung vào tính an toàn và lợi nhuận dài hạn';
      }
    }
    
    // Xác định strategy dựa trên personality type
    if (personalityType === 'emotional') {
      approachStrategy = 'Sử dụng câu chuyện cảm động, kết nối tình cảm, nhấn mạnh gia đình';
      weaknessToExploit = 'Dễ bị tác động bởi cảm xúc, có thể quyết định nhanh khi được kích thích đúng cách';
    } else if (personalityType === 'practical') {
      approachStrategy = 'Đưa ra số liệu cụ thể, bằng chứng thực tế, ROI rõ ràng';
      weaknessToExploit = 'Có thể bỏ lỡ cơ hội nếu suy tính quá kỹ, cần tạo áp lực thời gian';
    } else {
      approachStrategy = 'Kết hợp cả cảm xúc và logic, cân bằng giữa lợi ích và tình cảm';
      weaknessToExploit = 'Cần thời gian để quyết định, có thể dao động giữa các lựa chọn';
    }
    
    return {
      customerId: customer.id,
      personalityType,
      motivationFactors,
      fears,
      approachStrategy,
      weaknessToExploit,
      salesStrategy: '',
      communicationStyle: '',
      trustBuilding: '',
      analysisNotes: '',
      lastUpdated: new Date().toISOString()
    };
  };

  /**
   * Lưu profile
   */
  const saveProfile = () => {
    if (!currentProfile || !editingCustomerId) return;
    
    const updatedProfiles = {
      ...profiles,
      [editingCustomerId]: {
        ...currentProfile,
        lastUpdated: new Date().toISOString()
      }
    };
    
    setProfiles(updatedProfiles);
    localStorage.setItem('psychologicalProfiles', JSON.stringify(updatedProfiles));
    setEditingCustomerId(null);
  };

  /**
   * Cập nhật profile hiện tại
   */
  const updateCurrentProfile = (field: keyof PsychologicalProfile, value: any) => {
    if (!currentProfile) return;
    
    setCurrentProfile({
      ...currentProfile,
      [field]: value
    });
  };

  /**
   * Thêm/xóa motivation factor
   */
  const toggleMotivationFactor = (factor: string) => {
    if (!currentProfile) return;
    
    const factors = currentProfile.motivationFactors.includes(factor)
      ? currentProfile.motivationFactors.filter(f => f !== factor)
      : [...currentProfile.motivationFactors, factor];
      
    updateCurrentProfile('motivationFactors', factors);
  };

  /**
   * Thêm/xóa fear
   */
  const toggleFear = (fear: string) => {
    if (!currentProfile) return;
    
    const fears = currentProfile.fears.includes(fear)
      ? currentProfile.fears.filter(f => f !== fear)
      : [...currentProfile.fears, fear];
      
    updateCurrentProfile('fears', fears);
  };

  /**
   * Lấy màu cho personality type
   */
  const getPersonalityColor = (type: string) => {
    switch (type) {
      case 'emotional': return 'bg-pink-100 text-pink-800';
      case 'practical': return 'bg-blue-100 text-blue-800'; 
      case 'mixed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Danh sách motivation factors có sẵn
   */
  const motivationOptions = [
    'Muốn giàu có', 'Thoát nghèo', 'Bảo vệ gia đình', 'Tự do tài chính',
    'Thành công trong sự nghiệp', 'Mua nhà mới', 'Học hành cho con',
    'Du lịch nhiều hơn', 'An toàn tài chính', 'Thoát khỏi công việc hiện tại',
    'Đầu tư cho tương lai', 'Cải thiện chất lượng sống'
  ];

  /**
   * Danh sách fears có sẵn
   */
  const fearOptions = [
    'Sợ mất tiền', 'Sợ bị lừa đảo', 'Sợ rủi ro', 'Sợ không hiểu công nghệ',
    'Sợ mất việc', 'Sợ già không có tiền', 'Sợ gia đình khó khăn',
    'Sợ bị cười nhạo', 'Sợ thất bại', 'Sợ không theo kịp thời đại',
    'Sợ cô đơn', 'Sợ bệnh tật'
  ];

  return (
    <div className="space-y-6">




      {/* Psychological Analysis */}
      {selectedCustomer && currentProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Hồ Sơ Tâm Lý - {selectedCustomer.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Personality Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Loại tính cách:</label>
                <Select 
                  value={currentProfile.personalityType || 'mixed'} 
                  onValueChange={(value) => updateCurrentProfile('personalityType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emotional">Sống Tình Cảm</SelectItem>
                    <SelectItem value="practical">Sống Thực Tế</SelectItem>
                    <SelectItem value="mixed">Cân Bằng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Motivation Factors */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  Động lực chính:
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {motivationOptions.map(option => (
                    <Button
                      key={option}
                      variant={currentProfile.motivationFactors.includes(option) ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => toggleMotivationFactor(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.motivationFactors.map(factor => (
                    <Badge key={factor} className="bg-green-100 text-green-800 text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Fears */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Nỗi sợ và Lo lắng:
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {fearOptions.map(option => (
                    <Button
                      key={option}
                      variant={currentProfile.fears.includes(option) ? "destructive" : "outline"}
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => toggleFear(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.fears.map(fear => (
                    <Badge key={fear} className="bg-red-100 text-red-800 text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {fear}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategy & Approach */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Chiến Lược Tiếp Cận
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Approach Strategy */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Chiến lược tiếp cận:
                </label>
                <Textarea
                  placeholder="Nhập cách tiếp cận phù hợp với tính cách khách hàng..."
                  value={currentProfile.approachStrategy}
                  onChange={(e) => updateCurrentProfile('approachStrategy', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Weakness to Exploit */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  Điểm yếu có thể khai thác:
                </label>
                <Textarea
                  placeholder="Nhập những điểm yếu hoặc đặc điểm có thể tận dụng..."
                  value={currentProfile.weaknessToExploit}
                  onChange={(e) => updateCurrentProfile('weaknessToExploit', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Communication Style */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  Phong cách giao tiếp:
                </label>
                <Textarea
                  placeholder="Cách nói chuyện, ngôn từ, tốc độ phù hợp..."
                  value={currentProfile.communicationStyle}
                  onChange={(e) => updateCurrentProfile('communicationStyle', e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              {/* Trust Building */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Cách xây dựng lòng tin:
                </label>
                <Textarea
                  placeholder="Làm thế nào để khách hàng tin tưởng bạn..."
                  value={currentProfile.trustBuilding}
                  onChange={(e) => updateCurrentProfile('trustBuilding', e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sales Strategy */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Chiến Lược Bán Hàng Cụ Thể
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Kế hoạch bán hàng chi tiết:</label>
                <Textarea
                  placeholder="Nhập kế hoạch bán hàng cụ thể, các bước tiếp cận, thời điểm phù hợp..."
                  value={currentProfile.salesStrategy}
                  onChange={(e) => updateCurrentProfile('salesStrategy', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ghi chú phân tích thêm:</label>
                <Textarea
                  placeholder="Các nhận xét, quan sát thêm về khách hàng..."
                  value={currentProfile.analysisNotes}
                  onChange={(e) => updateCurrentProfile('analysisNotes', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={saveProfile} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Lưu Phân Tích
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const newAnalysis = generateAutoAnalysis(selectedCustomer);
                    setCurrentProfile(newAnalysis);
                  }}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Phân Tích Tự Động
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results - Show when profile is saved */}
          {selectedCustomer && profiles[selectedCustomer.id] && !editingCustomerId && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  Kết Quả Phân Tích - {selectedCustomer.name}
                  <Badge className="bg-green-100 text-green-800 ml-2">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Đã lưu
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personality Summary */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-800">Tóm Tắt Tính Cách</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Loại tính cách:</p>
                      <Badge className={getPersonalityColor(profiles[selectedCustomer.id].personalityType)}>
                        {profiles[selectedCustomer.id].personalityType === 'emotional' ? 'Sống Tình Cảm' :
                         profiles[selectedCustomer.id].personalityType === 'practical' ? 'Sống Thực Tế' : 'Cân Bằng'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cập nhật lần cuối:</p>
                      <p className="text-sm font-medium">
                        {new Date(profiles[selectedCustomer.id].lastUpdated).toLocaleDateString('vi-VN')} lúc{' '}
                        {new Date(profiles[selectedCustomer.id].lastUpdated).toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Motivations */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-green-600" />
                      <h4 className="font-medium text-green-800">Động Lực Chính</h4>
                    </div>
                    <div className="space-y-2">
                      {profiles[selectedCustomer.id].motivationFactors.length > 0 ? (
                        profiles[selectedCustomer.id].motivationFactors.map((factor, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-700">{factor}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Chưa xác định động lực</p>
                      )}
                    </div>
                  </div>

                  {/* Fears */}
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h4 className="font-medium text-red-800">Nỗi Sợ & Lo Lắng</h4>
                    </div>
                    <div className="space-y-2">
                      {profiles[selectedCustomer.id].fears.length > 0 ? (
                        profiles[selectedCustomer.id].fears.map((fear, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-red-700">{fear}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Chưa xác định nỗi sợ</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Strategy Summary */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-800">Chiến Lược Tiếp Cận</h4>
                  </div>
                  <div className="space-y-3">
                    {profiles[selectedCustomer.id].approachStrategy && (
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-1">CÁCH TIẾP CẬN:</p>
                        <p className="text-sm text-blue-700 bg-white p-2 rounded border">
                          {profiles[selectedCustomer.id].approachStrategy}
                        </p>
                      </div>
                    )}
                    {profiles[selectedCustomer.id].weaknessToExploit && (
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-1">ĐIỂM YẾU CÓ THỂ KHAI THÁC:</p>
                        <p className="text-sm text-blue-700 bg-white p-2 rounded border">
                          {profiles[selectedCustomer.id].weaknessToExploit}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Communication & Trust */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profiles[selectedCustomer.id].communicationStyle && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-purple-600" />
                        <h4 className="font-medium text-purple-800">Phong Cách Giao Tiếp</h4>
                      </div>
                      <p className="text-sm text-purple-700">
                        {profiles[selectedCustomer.id].communicationStyle}
                      </p>
                    </div>
                  )}

                  {profiles[selectedCustomer.id].trustBuilding && (
                    <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-teal-600" />
                        <h4 className="font-medium text-teal-800">Xây Dựng Lòng Tin</h4>
                      </div>
                      <p className="text-sm text-teal-700">
                        {profiles[selectedCustomer.id].trustBuilding}
                      </p>
                    </div>
                  )}
                </div>

                {/* Sales Strategy */}
                {profiles[selectedCustomer.id].salesStrategy && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-4 h-4 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Kế Hoạch Bán Hàng Chi Tiết</h4>
                    </div>
                    <p className="text-sm text-yellow-700 whitespace-pre-line">
                      {profiles[selectedCustomer.id].salesStrategy}
                    </p>
                  </div>
                )}

                {/* Analysis Notes */}
                {profiles[selectedCustomer.id].analysisNotes && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-gray-600" />
                      <h4 className="font-medium text-gray-800">Ghi Chú Phân Tích</h4>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {profiles[selectedCustomer.id].analysisNotes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => setEditingCustomerId(selectedCustomer.id)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh Sửa Phân Tích
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const updatedProfiles = { ...profiles };
                      delete updatedProfiles[selectedCustomer.id];
                      setProfiles(updatedProfiles);
                      localStorage.setItem('psychologicalProfiles', JSON.stringify(updatedProfiles));
                      setCurrentProfile(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa Phân Tích
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
