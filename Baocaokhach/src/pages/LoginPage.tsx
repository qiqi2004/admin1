/**
 * Trang đăng nhập với 2 loại tài khoản: Manager và Employee
 * Giao diện đẹp với form validation và loading state
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { 
  User, 
  Lock, 
  LogIn, 
  UserCog, 
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  Briefcase,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('manager');
  const [showZaloQR, setShowZaloQR] = useState(false);

  /**
   * Xử lý submit form đăng nhập
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin đăng nhập');
      return;
    }

    try {
      const result = await login(formData.username, formData.password);
      if (!result.success) {
        setError(result.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
      }
      // Nếu đăng nhập thành công, AuthContext sẽ tự động chuyển hướng
    } catch (error) {
      setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
      console.error('Login error:', error);
    }
  };

  /**
   * Cập nhật form data
   */
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  /**
   * Đăng nhập nhanh với tài khoản demo
   */
  const quickLogin = (username: string, password: string) => {
    setFormData({ username, password });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hệ Thống Chăn Bò
          </h1>
          <p className="text-gray-600">
            Đăng nhập để truy cập vào hệ thống quản lý
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <CardTitle className="text-center text-xl">Đăng Nhập Hệ Thống</CardTitle>
            <p className="text-center text-sm text-gray-600">
              Liên Hệ ADMIN Để Được Cung Cấp Gói Tài Khoản
            </p>
            
            {/* Contact Admin Buttons */}
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://zalo.me/+84777574537', '_blank')}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/2048px-Icon_of_Zalo.svg.png" 
                  alt="Zalo" 
                  className="w-4 h-4"
                />
                Zalo
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://t.me/Qi_266', '_blank')}
                className="flex items-center gap-2 bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-700"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/2048px-Telegram_2019_Logo.svg.png" 
                  alt="Telegram" 
                  className="w-4 h-4"
                />
                Telegram
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://wa.me/+84777333038', '_blank')}
                className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
              >
                <img 
                  src="https://png.pngtree.com/element_our/sm/20180626/sm_5b321c99945a2.jpg" 
                  alt="WhatsApp" 
                  className="w-4 h-4"
                />
                WhatsApp
              </Button>
            </div>
            
            {/* Account Type Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manager" className="flex items-center gap-2">
                  <UserCog className="w-4 h-4" />
                  Quản Lý
                </TabsTrigger>
                <TabsTrigger value="employee" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Nhân Viên
                </TabsTrigger>
              </TabsList>

              {/* Manager Login */}
              <TabsContent value="manager" className="space-y-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCog className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Tài Khoản Quản Lý</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Quản lý nhóm, thành viên và toàn bộ hệ thống
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Quản lý nhóm</Badge>
                    <Badge variant="outline" className="text-xs">Thêm/xóa thành viên</Badge>
                    <Badge variant="outline" className="text-xs">Xem tất cả dữ liệu</Badge>
                  </div>
                </div>
                

              </TabsContent>

              {/* Employee Login */}
              <TabsContent value="employee" className="space-y-4 mt-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Tài Khoản Nhân Viên</span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    Quản lý khách hàng được phân công
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Quản lý khách hàng</Badge>
                    <Badge variant="outline" className="text-xs">Theo dõi tiến độ</Badge>
                    <Badge variant="outline" className="text-xs">Báo cáo thống kê</Badge>
                  </div>
                </div>


              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên đăng nhập</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Nhập tên đăng nhập..."
                    value={formData.username}
                    onChange={(e) => updateFormData('username', e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu..."
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang đăng nhập...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Đăng Nhập
                  </div>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500">
                © 2024 Hệ Thống Chăn Bò. Phiên bản 2.0
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Tính năng hệ thống:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="text-xs">Quản lý nhóm</Badge>
            <Badge variant="secondary" className="text-xs">Phân quyền user</Badge>
            <Badge variant="secondary" className="text-xs">Theo dõi khách hàng</Badge>
            <Badge variant="secondary" className="text-xs">Báo cáo thống kê</Badge>
          </div>
        </div>

        {/* Zalo QR Code Modal */}
        <Dialog open={showZaloQR} onOpenChange={setShowZaloQR}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">Z</span>
                </div>
                Liên Hệ Zalo Admin
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="bg-white p-4 rounded-lg shadow-lg border">
                <img 
                  src="https://pub-cdn.sider.ai/u/U0W8H74ZOWZ/web-coder/68653a48235f86442e432a7a/resource/76c6f54b-1dca-49f0-8da8-f90eecbcb56f.png"
                  alt="Zalo QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Qian</h3>
                <p className="text-gray-600">+84 7777 05622</p>

                <p className="text-sm text-gray-500">
                  Mở Zalo bấm nút quét QR để quét kết bạn
                </p>
              </div>
              <Button 
                onClick={() => setShowZaloQR(false)}
                className="w-full"
                variant="outline"
              >
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
