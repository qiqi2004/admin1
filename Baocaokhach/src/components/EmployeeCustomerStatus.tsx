/**
 * Component hiển thị tình trạng khách hàng của các nhân viên - dành cho Manager
 * Cho phép xem và theo dõi hiệu suất làm việc của từng nhân viên
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  User, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Eye,
  BarChart3,
  Calendar,
  Filter,
  UserCheck,
  UserX,
  Target,
  Award,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Interface cho Customer
 */
interface Customer {
  id: string;
  name: string;
  phone: string;
  status: 'new' | 'contacted' | 'interested' | 'completed' | 'failed';
  isPotential: boolean;
  createdAt: string;
  lastContact?: string;
  notes: string;
  userId: string;
}

/**
 * Interface cho Employee Stats
 */
interface EmployeeStats {
  userId: string;
  userName: string;
  fullName: string;
  totalCustomers: number;
  completedCustomers: number;
  potentialCustomers: number;
  newCustomers: number;
  contactedCustomers: number;
  interestedCustomers: number;
  failedCustomers: number;
  completionRate: number;
  lastActivity?: string;
}

export default function EmployeeCustomerStatus() {
  const { getAllUsers, currentGroup } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedEmployeeCustomers, setSelectedEmployeeCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'completion' | 'total' | 'potential'>('completion');

  /**
   * Load dữ liệu khi component mount
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load employees và customer stats
   */
  const loadData = () => {
    const allUsers = getAllUsers();
    const groupEmployees = allUsers.filter(user => 
      user.role === 'employee' && 
      user.groupId === currentGroup?.id &&
      user.isActive
    );
    
    setEmployees(groupEmployees);
    
    // Tính toán stats cho từng nhân viên
    const stats: EmployeeStats[] = groupEmployees.map(employee => {
      const customerData = localStorage.getItem(`customers_${employee.id}`);
      const customers: Customer[] = customerData ? JSON.parse(customerData) : [];
      
      const totalCustomers = customers.length;
      const completedCustomers = customers.filter(c => c.status === 'completed').length;
      const potentialCustomers = customers.filter(c => c.isPotential).length;
      const newCustomers = customers.filter(c => c.status === 'new').length;
      const contactedCustomers = customers.filter(c => c.status === 'contacted').length;
      const interestedCustomers = customers.filter(c => c.status === 'interested').length;
      const failedCustomers = customers.filter(c => c.status === 'failed').length;
      const completionRate = totalCustomers > 0 ? Math.round((completedCustomers / totalCustomers) * 100) : 0;
      
      // Tìm hoạt động gần nhất
      const lastActivity = customers.length > 0 
        ? customers.reduce((latest, customer) => {
            const customerDate = new Date(customer.lastContact || customer.createdAt);
            const latestDate = new Date(latest);
            return customerDate > latestDate ? customer.lastContact || customer.createdAt : latest;
          }, customers[0].lastContact || customers[0].createdAt)
        : undefined;

      return {
        userId: employee.id,
        userName: employee.username,
        fullName: employee.fullName,
        totalCustomers,
        completedCustomers,
        potentialCustomers,
        newCustomers,
        contactedCustomers,
        interestedCustomers,
        failedCustomers,
        completionRate,
        lastActivity
      };
    });

    setEmployeeStats(stats);
  };

  /**
   * Load customer details của một nhân viên
   */
  const loadEmployeeCustomers = (employeeId: string) => {
    const customerData = localStorage.getItem(`customers_${employeeId}`);
    const customers: Customer[] = customerData ? JSON.parse(customerData) : [];
    setSelectedEmployeeCustomers(customers);
    setSelectedEmployee(employeeId);
  };

  /**
   * Lọc và sắp xếp employees
   */
  const getFilteredAndSortedStats = () => {
    let filtered = employeeStats.filter(stat =>
      stat.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sắp xếp
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName);
        case 'completion':
          return b.completionRate - a.completionRate;
        case 'total':
          return b.totalCustomers - a.totalCustomers;
        case 'potential':
          return b.potentialCustomers - a.potentialCustomers;
        default:
          return 0;
      }
    });

    return filtered;
  };

  /**
   * Lọc customers theo status
   */
  const getFilteredCustomers = () => {
    if (statusFilter === 'all') return selectedEmployeeCustomers;
    return selectedEmployeeCustomers.filter(customer => customer.status === statusFilter);
  };

  /**
   * Lấy màu badge theo status
   */
  const getStatusBadge = (status: string, count: number) => {
    const variants: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-700',
      'contacted': 'bg-yellow-100 text-yellow-700',
      'interested': 'bg-orange-100 text-orange-700',
      'completed': 'bg-green-100 text-green-700',
      'failed': 'bg-red-100 text-red-700'
    };

    const labels: Record<string, string> = {
      'new': 'Mới',
      'contacted': 'Đã liên hệ',
      'interested': 'Quan tâm',
      'completed': 'Hoàn thành',
      'failed': 'Thất bại'
    };

    return (
      <Badge className={variants[status]} variant="secondary">
        {labels[status]}: {count}
      </Badge>
    );
  };

  /**
   * Lấy employee được chọn
   */
  const getSelectedEmployeeInfo = () => {
    return employees.find(emp => emp.id === selectedEmployee);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Tổng Quan Nhân Viên
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Chi Tiết Khách Hàng
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tình Trạng Khách Hàng Nhân Viên</h2>
              <p className="text-gray-600">Theo dõi hiệu suất làm việc của từng nhân viên</p>
            </div>

            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm nhân viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completion">Tỷ lệ hoàn thành</SelectItem>
                  <SelectItem value="total">Tổng khách hàng</SelectItem>
                  <SelectItem value="potential">Khách tiềm năng</SelectItem>
                  <SelectItem value="name">Tên nhân viên</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={loadData} variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {getFilteredAndSortedStats().length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có nhân viên</h3>
                <p className="text-gray-500">Chưa có nhân viên hoạt động trong nhóm</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredAndSortedStats().map((stat) => (
                <Card key={stat.userId} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {stat.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{stat.fullName}</CardTitle>
                        <p className="text-sm text-gray-600">@{stat.userName}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Performance Indicator */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tỷ lệ hoàn thành:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              stat.completionRate >= 80 ? 'bg-green-500' :
                              stat.completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${stat.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{stat.completionRate}%</span>
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-bold text-blue-600">{stat.totalCustomers}</div>
                        <div className="text-gray-600">Tổng KH</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-bold text-green-600">{stat.completedCustomers}</div>
                        <div className="text-gray-600">Hoàn thành</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="font-bold text-yellow-600">{stat.potentialCustomers}</div>
                        <div className="text-gray-600">Tiềm năng</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="font-bold text-red-600">{stat.failedCustomers}</div>
                        <div className="text-gray-600">Thất bại</div>
                      </div>
                    </div>

                    {/* Status Breakdown */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {getStatusBadge('new', stat.newCustomers)}
                        {getStatusBadge('contacted', stat.contactedCustomers)}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {getStatusBadge('interested', stat.interestedCustomers)}
                      </div>
                    </div>

                    {/* Last Activity */}
                    {stat.lastActivity && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                        <Clock className="w-3 h-3" />
                        Hoạt động cuối: {new Date(stat.lastActivity).toLocaleDateString('vi-VN')}
                      </div>
                    )}

                    {/* View Details Button */}
                    <Button 
                      onClick={() => loadEmployeeCustomers(stat.userId)}
                      variant="outline" 
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem Chi Tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {selectedEmployee ? (
            <>
              {/* Employee Info Header */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {getSelectedEmployeeInfo()?.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{getSelectedEmployeeInfo()?.fullName}</h3>
                        <p className="text-gray-600">@{getSelectedEmployeeInfo()?.username}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả trạng thái</SelectItem>
                          <SelectItem value="new">Mới</SelectItem>
                          <SelectItem value="contacted">Đã liên hệ</SelectItem>
                          <SelectItem value="interested">Quan tâm</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="failed">Thất bại</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button onClick={() => setSelectedEmployee('')} variant="outline">
                        Quay lại
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer List */}
              {getFilteredCustomers().length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có khách hàng</h3>
                    <p className="text-gray-500">
                      {statusFilter === 'all' ? 'Nhân viên chưa có khách hàng nào' : `Không có khách hàng ở trạng thái "${statusFilter}"`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredCustomers().map((customer) => (
                    <Card key={customer.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{customer.name}</h4>
                            {customer.isPotential && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                                <Target className="w-3 h-3 mr-1" />
                                Tiềm năng
                              </Badge>
                            )}
                          </div>

                          <div className="text-sm text-gray-600">
                            <p>📞 {customer.phone}</p>
                            <p>📅 {new Date(customer.createdAt).toLocaleDateString('vi-VN')}</p>
                            {customer.lastContact && (
                              <p>🔄 {new Date(customer.lastContact).toLocaleDateString('vi-VN')}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge 
                              variant={customer.status === 'completed' ? 'default' : 'secondary'}
                              className={
                                customer.status === 'completed' ? 'bg-green-100 text-green-700' :
                                customer.status === 'interested' ? 'bg-orange-100 text-orange-700' :
                                customer.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                                customer.status === 'failed' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }
                            >
                              {customer.status === 'new' ? 'Mới' :
                               customer.status === 'contacted' ? 'Đã liên hệ' :
                               customer.status === 'interested' ? 'Quan tâm' :
                               customer.status === 'completed' ? 'Hoàn thành' : 'Thất bại'}
                            </Badge>
                          </div>

                          {customer.notes && (
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                              💭 {customer.notes}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chọn nhân viên để xem chi tiết</h3>
                <p className="text-gray-500">Nhấn "Xem Chi Tiết" ở tab Tổng Quan để xem khách hàng của nhân viên</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
