/**
 * Component danh sách khách hàng
 * Hiển thị và quản lý danh sách khách hàng
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { 
  UserPlus, 
  Search, 
  Calendar, 
  TrendingUp,
  MoreHorizontal,
  CheckCircle,
  Clock,
  User,
  Heart,
  Target,
  UserX,
  TrendingDown,
  MessageSquare,
  Star,
  StarOff,
  Trash2,
  DollarSign,
  CreditCard,
  Banknote,
  Edit3,
  Eye
} from 'lucide-react';
import CustomerSummary from './CustomerSummary';
import { getValidSelectValue } from '../utils/selectFixer';

/**
 * Interface cho props của CustomerList
 */
interface CustomerListProps {
  customers: any[];
  onSelectCustomer: (customer: any) => void;
  onAddCustomer: (name: string) => void;
  onUpdateProgress: (customerId: string, day: number, completed: boolean) => void;
  onUpdatePotential?: (customerId: string, isPotential: boolean, score?: number, notes?: string) => void;
  onUpdateDeposit?: (customerId: string, hasDeposited: boolean, amount?: number, notes?: string) => void;
  onDeleteCustomer?: (customerId: string) => void;
  showPotentialOnly?: boolean;
  showDepositedOnly?: boolean;
  title?: string;
  subtitle?: string;
}

export default function CustomerList({ 
  customers, 
  onSelectCustomer, 
  onAddCustomer, 
  onUpdateProgress,
  onUpdatePotential,
  onUpdateDeposit,
  onDeleteCustomer,
  showPotentialOnly = false,
  showDepositedOnly = false,
  title = "Danh Sách Khách Hàng",
  subtitle = "Quản lý và theo dõi thông tin khách hàng"
}: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState<any>(null);

  /**
   * Lọc khách hàng theo từ khóa tìm kiếm
   */
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Xử lý thêm khách hàng mới
   */
  const handleAddCustomer = () => {
    if (newCustomerName.trim()) {
      onAddCustomer(newCustomerName.trim());
      setNewCustomerName('');
      setIsAddDialogOpen(false);
    }
  };

  /**
   * Lấy màu sắc badge theo trạng thái
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'active':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'paused':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  /**
   * Lấy text hiển thị theo trạng thái
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'active':
        return 'Đang tiến hành';
      case 'paused':
        return 'Tạm dừng';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  {title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-sm sm:text-base">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Thêm Khách Hàng
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Thêm Khách Hàng Mới</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Tên khách hàng</label>
                      <Input
                        placeholder="Nhập tên khách hàng..."
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
                        className="h-10"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleAddCustomer} disabled={!newCustomerName.trim()} className="flex-1">
                        Thêm
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                        Hủy
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-gray-50/50 border-0 focus:bg-white transition-colors"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                <div className="text-lg sm:text-xl font-bold text-blue-600">{customers.length}</div>
                <div className="text-xs text-blue-700">Tổng số</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <div className="text-lg sm:text-xl font-bold text-green-600">
                  {customers.filter(c => c.status === 'completed').length}
                </div>
                <div className="text-xs text-green-700">Hoàn thành</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                <div className="text-lg sm:text-xl font-bold text-yellow-600">
                  {customers.filter(c => c.isPotential).length}
                </div>
                <div className="text-xs text-yellow-700">Tiềm năng</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <div className="text-lg sm:text-xl font-bold text-purple-600">
                  {customers.filter(c => c.hasDeposited).length}
                </div>
                <div className="text-xs text-purple-700">Đã nạp</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Grid */}
        {filteredCustomers.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm ? 'Không tìm thấy khách hàng' : 'Chưa có khách hàng'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Thử tìm kiếm với từ khóa khác' 
                  : 'Hãy thêm khách hàng đầu tiên để bắt đầu'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Thêm Khách Hàng Đầu Tiên
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        {customer.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getStatusColor(customer.status)}`}>
                          {getStatusText(customer.status)}
                        </Badge>
                        {customer.isPotential && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Tiềm năng
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-600">Tiến độ</span>
                      <span className="text-xs font-bold text-gray-800">
                        {customer.totalProgress.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={customer.totalProgress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Ngày {customer.currentDay || 1}/7</span>
                      <span>{customer.completedDays?.length || 0} ngày hoàn thành</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Tạo:</span>
                      <span className="font-medium">
                        {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Cập nhật:</span>
                      <span className="font-medium">
                        {new Date(customer.lastUpdated).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  {/* Special Badges */}
                  <div className="flex flex-wrap gap-1">
                    {customer.hasDeposited && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Đã nạp: {customer.depositAmount?.toLocaleString('vi-VN') || 'N/A'}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs h-8"
                      onClick={() => {
                        onSelectCustomer(customer);
                        // Dispatch event to switch to form tab
                        window.dispatchEvent(new CustomEvent('switchToCustomerForm', {
                          detail: { customerId: customer.id }
                        }));
                      }}
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Nhập liệu
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 px-2">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Chi tiết khách hàng: {customer.name}</DialogTitle>
                        </DialogHeader>
                        <CustomerSummary 
                          customerId={customer.id}
                          customerName={customer.name}
                        />
                      </DialogContent>
                    </Dialog>

                    {onDeleteCustomer && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-2 text-red-600 hover:text-red-700">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa khách hàng</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa khách hàng "{customer.name}"? 
                              Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteCustomer(customer.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
