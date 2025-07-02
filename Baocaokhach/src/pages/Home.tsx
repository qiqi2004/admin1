/**
 * Trang chủ - Dashboard theo dõi tiến độ khách hàng
 * Hiển thị tổng quan tình trạng khách hàng và điều hướng đến các ngày
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Clock,
  UserPlus,
  DollarSign,
  Heart,
  Briefcase,
  Home as HomeIcon,
  MessageCircle,
  Settings,
  FileText,
  BarChart3,
  Star,
  PlusCircle,
  AlertCircle,
  Headphones,
  Smartphone,
  Globe,
  Cpu,
  Bot,
  Code,
  ExternalLink,
  Zap,
  Shield,
  Rocket,
  Phone
} from 'lucide-react';
import CustomerForm from '../components/CustomerForm';
import CustomerList from '../components/CustomerList';
import Analytics from '../components/Analytics';
import CustomerSummary from '../components/CustomerSummary';
import PsychologicalAnalysis from '../components/PsychologicalAnalysis';

/**
 * Interface cho dữ liệu khách hàng
 */
interface Customer {
  id: string;
  name: string;
  createdAt: string;
  currentDay: number;
  completedDays: number[];
  totalProgress: number;
  status: 'active' | 'completed' | 'paused';
  lastUpdated: string;
  isPotential?: boolean;
  potentialScore?: number;
  potentialNotes?: string;
  hasDeposited?: boolean;
  depositAmount?: number;
  depositDate?: string;
  depositNotes?: string;
}

export default function Home() {
  const { currentUser } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  /**
   * Load dữ liệu khách hàng từ localStorage theo user
   */
  useEffect(() => {
    if (currentUser) {
      const savedCustomers = localStorage.getItem(`customers_${currentUser.id}`);
      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers));
      }
    }
  }, [currentUser]);

  /**
   * Lưu dữ liệu khách hàng vào localStorage theo user
   */
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`customers_${currentUser.id}`, JSON.stringify(customers));
    }
  }, [customers, currentUser]);

  /**
   * Thêm khách hàng mới
   */
  const addCustomer = (name: string) => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      currentDay: 1,
      completedDays: [],
      totalProgress: 0,
      status: 'active',
      lastUpdated: new Date().toISOString()
    };
    setCustomers([...customers, newCustomer]);
  };

  /**
   * Cập nhật tiến độ khách hàng
   */
  const updateCustomerProgress = (customerId: string, day: number, completed: boolean) => {
    setCustomers(customers.map(customer => {
      if (customer.id === customerId) {
        const completedDays = completed 
          ? [...customer.completedDays, day].filter((d, i, arr) => arr.indexOf(d) === i)
          : customer.completedDays.filter(d => d !== day);
        
        return {
          ...customer,
          completedDays,
          totalProgress: (completedDays.length / 7) * 100,
          currentDay: Math.max(...completedDays, 0) + 1,
          status: completedDays.length === 7 ? 'completed' : 'active',
          lastUpdated: new Date().toISOString()
        };
      }
      return customer;
    }));
  };

  /**
   * Cập nhật trạng thái tiềm năng của khách hàng
   */
  const updateCustomerPotential = (customerId: string, isPotential: boolean, score?: number, notes?: string) => {
    setCustomers(customers.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          isPotential,
          potentialScore: score,
          potentialNotes: notes,
          lastUpdated: new Date().toISOString()
        };
      }
      return customer;
    }));
  };

  /**
   * Cập nhật trạng thái nạp tiền của khách hàng
   */
  const updateCustomerDeposit = (customerId: string, hasDeposited: boolean, amount?: number, notes?: string) => {
    setCustomers(customers.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          hasDeposited,
          depositAmount: amount,
          depositDate: hasDeposited ? new Date().toISOString() : undefined,
          depositNotes: notes,
          lastUpdated: new Date().toISOString()
        };
      }
      return customer;
    }));
  };

  /**
   * Xóa khách hàng
   */
  const deleteCustomer = (customerId: string) => {
    // Xóa khách hàng khỏi danh sách
    setCustomers(customers.filter(customer => customer.id !== customerId));
    
    // Xóa dữ liệu liên quan khỏi localStorage
    localStorage.removeItem(`customerSummary_${customerId}`);
    
    // Xóa dữ liệu form
    const savedFormData = localStorage.getItem('customerFormData');
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      delete formData[customerId];
      localStorage.setItem('customerFormData', JSON.stringify(formData));
    }
    
    // Reset selectedCustomer nếu đang chọn khách hàng này
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer(null);
    }
  };

  /**
   * Thống kê tổng quan
   */
  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    completedCustomers: customers.filter(c => c.status === 'completed').length,
    potentialCustomers: customers.filter(c => c.isPotential).length,
    depositedCustomers: customers.filter(c => c.hasDeposited).length,
    totalDepositAmount: customers.reduce((sum, c) => sum + (c.depositAmount || 0), 0),
    averageProgress: customers.length > 0 
      ? customers.reduce((sum, c) => sum + c.totalProgress, 0) / customers.length 
      : 0
  };

  /**
   * Các giai đoạn theo dõi 7 ngày
   */
  const dayPhases = [
    {
      day: 1,
      title: 'Thông Tin Cơ Bản & Cuộc Sống',
      icon: <HomeIcon className="w-5 h-5" />,
      color: 'bg-blue-500',
      description: 'Tên tuổi, quê quán, nghề nghiệp, tình trạng hôn nhân'
    },
    {
      day: 2,
      title: 'Tài Chính & Sinh Hoạt',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-green-500',
      description: 'Thu nhập, chi phí, thói quen chi tiêu, sở thích'
    },
    {
      day: 3,
      title: 'Đầu Tư & Tiền Điện Tử',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-purple-500',
      description: 'Kinh nghiệm đầu tư, hiểu biết về crypto'
    },
    {
      day: 4,
      title: 'Quá Khứ & Bị Lừa & Nợ',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-orange-500',
      description: 'Kỷ niệm, trải nghiệm bị lừa, áp lực tài chính'
    },
    {
      day: 5,
      title: 'Dự Định & Ước Mơ',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-pink-500',
      description: 'Mục tiêu tương lai, quan điểm về tiền bạc'
    },
    {
      day: 6,
      title: 'Cuộc Sống & Tình Cảm',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-red-500',
      description: 'Gu bạn đời, quan điểm yêu đương, các mối quan hệ'
    },
    {
      day: 7,
      title: 'Định Hướng Tương Lai',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-indigo-500',
      description: 'Kết nối niềm tin, mở rộng cơ hội đầu tư'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 h-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs px-2 py-1">
            <HomeIcon className="w-3 h-3" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-1 text-xs px-2 py-1">
            <Users className="w-3 h-3" />
            <span className="hidden sm:inline">Khách Hàng</span>
          </TabsTrigger>
          <TabsTrigger value="potential" className="flex items-center gap-1 text-xs px-2 py-1">
            <Star className="w-3 h-3" />
            <span className="hidden sm:inline">Tiềm Năng</span>
          </TabsTrigger>
          <TabsTrigger value="form" className="flex items-center gap-1 text-xs px-2 py-1">
            <PlusCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Nhập Liệu</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-1 text-xs px-2 py-1">
            <FileText className="w-3 h-3" />
            <span className="hidden sm:inline">Tóm Tắt</span>
          </TabsTrigger>
          <TabsTrigger value="psychology" className="flex items-center gap-1 text-xs px-2 py-1">
            <Headphones className="w-3 h-3" />
            <span className="hidden sm:inline">Tâm Lý</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs px-2 py-1">
            <BarChart3 className="w-3 h-3" />
            <span className="hidden sm:inline">Thống Kê</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-3">
                <CardTitle className="text-xs font-medium">Tổng KH ({stats.totalCustomers})</CardTitle>
                <Users className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="text-xl font-bold">{stats.totalCustomers}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-3">
                <CardTitle className="text-xs font-medium">Đang TH ({stats.activeCustomers})</CardTitle>
                <Clock className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="text-xl font-bold">{stats.activeCustomers}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-3">
                <CardTitle className="text-xs font-medium">Hoàn Thành ({stats.completedCustomers})</CardTitle>
                <CheckCircle className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="text-xl font-bold">{stats.completedCustomers}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-3">
                <CardTitle className="text-xs font-medium">Tiềm Năng ({stats.potentialCustomers})</CardTitle>
                <Target className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="text-xl font-bold">{stats.potentialCustomers}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-3">
                <CardTitle className="text-xs font-medium">Tiến Độ TB</CardTitle>
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="text-xl font-bold">{stats.averageProgress.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Services Advertisement Section */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center gap-3">
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                🚀 DỊCH VỤ CÔNG NGHỆ CHUYÊN NGHIỆP 🚀
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600 font-medium">
                Cung cấp giải pháp công nghệ toàn diện cho doanh nghiệp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Website & App Development */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Website & Mobile App</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">Phát triển website và ứng dụng di động chuyên nghiệp theo yêu cầu</p>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      <Globe className="w-3 h-3 mr-1" />
                      Công nghệ mới nhất
                    </Badge>
                  </CardContent>
                </Card>

                {/* CRM System */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Hệ Thống CRM</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">Quản lý khách hàng toàn diện với AI và analytics</p>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <Shield className="w-3 h-3 mr-1" />
                      Bảo mật cao
                    </Badge>
                  </CardContent>
                </Card>

                {/* AI Technology */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Công Nghệ AI & Chatbot</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">Tự động hóa quy trình với AI thông minh</p>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      <Cpu className="w-3 h-3 mr-1" />
                      AI Tiên tiến
                    </Badge>
                  </CardContent>
                </Card>

                {/* Social Media Services */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Dịch Vụ Marketing</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">Quản lý mạng xã hội và marketing automation</p>
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      <Zap className="w-3 h-3 mr-1" />
                      Hiệu quả cao
                    </Badge>
                  </CardContent>
                </Card>

                {/* Banking Services */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Dịch Vụ Tài Chính</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">Tích hợp và tư vấn các dịch vụ ngân hàng</p>
                    <a 
                      href="https://t.me/bankviethello" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full"
                    >
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-xs sm:text-sm h-8 sm:h-9">
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Liên Hệ Ngay
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* More Services */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Và Nhiều Dịch Vụ Khác</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">Tư vấn và phát triển theo nhu cầu riêng của bạn</p>
                    <Badge className="bg-teal-100 text-teal-700 border-teal-200">
                      <Star className="w-3 h-3 mr-1" />
                      Tùy chỉnh
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Contact CTA */}
              <div className="mt-6 sm:mt-8 text-center">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-xl border border-yellow-200">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    💬 LIÊN HỆ ADMIN ĐỂ TƯ VẤN CHI TIẾT
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 mb-4 font-medium">
                    🔥 Ưu đãi đặc biệt cho khách hàng mới - Tư vấn miễn phí 24/7
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                    <Badge className="bg-red-100 text-red-700 border-red-200 px-4 py-2 text-sm font-medium">
                      ⚡ Phản hồi trong 5 phút
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
                      🎯 Giải pháp tối ưu
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium">
                      💰 Giá cạnh tranh
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Process Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Quy Trình 7 Ngày
              </CardTitle>
              <CardDescription>
                Tổng quan các giai đoạn thu thập thông tin khách hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dayPhases.map((phase) => (
                  <Card key={phase.day} className="relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 ${phase.color}`} />
                    <CardHeader className="pb-1 px-3 pt-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${phase.color} text-white`}>
                          <div className="w-3 h-3">{phase.icon}</div>
                        </div>
                        <div>
                          <CardTitle className="text-xs">Ngày {phase.day}</CardTitle>
                          <CardDescription className="text-xs">
                            {phase.title}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 pb-3">
                      <p className="text-xs text-gray-600">{phase.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt Động Gần Đây</CardTitle>
            </CardHeader>
            <CardContent>
              {customers.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có khách hàng nào. Hãy thêm khách hàng đầu tiên!</p>
                  <Button 
                    onClick={() => setActiveTab('customers')} 
                    className="mt-4"
                  >
                    Thêm Khách Hàng
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {customers.slice(0, 5).map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{customer.name}</h3>
                          <p className="text-sm text-gray-500">
                            Ngày {customer.currentDay} • Cập nhật {new Date(customer.lastUpdated).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24">
                          <Progress value={customer.totalProgress} className="h-2" />
                        </div>
                        <Badge variant={customer.status === 'completed' ? 'default' : 'secondary'}>
                          {customer.status === 'completed' ? 'Hoàn thành' : 'Đang tìm hiểu'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <CustomerList 
            customers={customers}
            onSelectCustomer={setSelectedCustomer}
            onAddCustomer={addCustomer}
            onUpdateProgress={updateCustomerProgress}
            onUpdatePotential={updateCustomerPotential}
            onDeleteCustomer={deleteCustomer}
          />
        </TabsContent>

        {/* Potential Customers Tab */}
        <TabsContent value="potential" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Khách Tiềm Năng</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.potentialCustomers}</div>
                <p className="text-xs text-muted-foreground">khách hàng</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã Nạp Tiền</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.depositedCustomers}</div>
                <p className="text-xs text-muted-foreground">khách hàng</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Nạp</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalDepositAmount.toLocaleString('vi-VN')}
                </div>
                <p className="text-xs text-muted-foreground">VNĐ</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="potential" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="potential" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Tiềm Năng ({stats.potentialCustomers})
              </TabsTrigger>
              <TabsTrigger value="deposited" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Đã Nạp Tiền ({stats.depositedCustomers})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="potential">
              <CustomerList 
                customers={customers.filter(c => c.isPotential && !c.hasDeposited)}
                onSelectCustomer={setSelectedCustomer}
                onAddCustomer={addCustomer}
                onUpdateProgress={updateCustomerProgress}
                onUpdatePotential={updateCustomerPotential}
                onUpdateDeposit={updateCustomerDeposit}
                onDeleteCustomer={deleteCustomer}
                showPotentialOnly={true}
                title="Khách Hàng Tiềm Năng"
                subtitle="Danh sách những khách hàng có tiềm năng đầu tư cao"
              />
            </TabsContent>

            <TabsContent value="deposited">
              <CustomerList 
                customers={customers.filter(c => c.hasDeposited)}
                onSelectCustomer={setSelectedCustomer}
                onAddCustomer={addCustomer}
                onUpdateProgress={updateCustomerProgress}
                onUpdatePotential={updateCustomerPotential}
                onUpdateDeposit={updateCustomerDeposit}
                onDeleteCustomer={deleteCustomer}
                showDepositedOnly={true}
                title="Khách Hàng Đã Nạp Tiền"
                subtitle="Danh sách những khách hàng đã thực hiện nạp tiền đầu tư"
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Form Tab */}
        <TabsContent value="form">
          <CustomerForm 
            customers={customers}
            selectedCustomer={selectedCustomer}
            onUpdateProgress={updateCustomerProgress}
            onUpdatePotential={updateCustomerPotential}
            dayPhases={dayPhases}
          />
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Tóm Tắt Thông Tin Khách Hàng
                </CardTitle>
                <CardDescription>
                  Xem và chỉnh sửa thông tin tóm tắt về tính cách, ước mơ và đặc điểm của từng khách hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có khách hàng nào để tóm tắt</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {customers.map((customer) => (
                      <CustomerSummary
                        key={customer.id}
                        customerId={customer.id}
                        customerName={customer.name}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Psychology Tab */}
        <TabsContent value="psychology">
          <PsychologicalAnalysis 
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Analytics customers={customers} dayPhases={dayPhases} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
