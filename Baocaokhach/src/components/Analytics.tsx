/**
 * Component Analytics hiển thị biểu đồ và thống kê
 * Cung cấp cái nhìn tổng quan về dữ liệu khách hàng
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Target,
  Star,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { getValidSelectValue } from '../utils/selectFixer';

/**
 * Interface cho props của Analytics
 */
interface AnalyticsProps {
  customers: any[];
}

export default function Analytics({ customers }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('all');
  const [viewType, setViewType] = useState('overview');

  /**
   * Tính toán thống kê cơ bản
   */
  const calculateStats = () => {
    const total = customers.length;
    const completed = customers.filter(c => c.status === 'completed').length;
    const active = customers.filter(c => c.status === 'active').length;
    const potential = customers.filter(c => c.isPotential).length;
    const avgProgress = total > 0 ? customers.reduce((sum, c) => sum + c.totalProgress, 0) / total : 0;

    return { total, completed, active, potential, avgProgress };
  };

  /**
   * Tính toán tiến độ theo ngày
   */
  const calculateDayProgress = () => {
    const dayStats = Array(7).fill(0).map((_, index) => ({
      day: index + 1,
      completed: 0,
      total: customers.length
    }));

    customers.forEach(customer => {
      customer.completedDays.forEach((day: number) => {
        if (day >= 1 && day <= 7) {
          dayStats[day - 1].completed++;
        }
      });
    });

    return dayStats;
  };

  /**
   * Tính toán thống kê theo thời gian
   */
  const calculateTimeStats = () => {
    const now = new Date();
    const filteredCustomers = customers.filter(customer => {
      const createdDate = new Date(customer.createdAt);
      
      switch (timeRange) {
        case 'week':
          return (now.getTime() - createdDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return (now.getTime() - createdDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        case 'quarter':
          return (now.getTime() - createdDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    return filteredCustomers;
  };

  const stats = calculateStats();
  const dayProgress = calculateDayProgress();
  const timeFilteredCustomers = calculateTimeStats();

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Phân Tích & Thống Kê</h2>
          <p className="text-gray-600">Cái nhìn tổng quan về hiệu quả làm việc</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={getValidSelectValue(timeRange, 'all')} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={getValidSelectValue(viewType, 'overview')} onValueChange={setViewType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Loại xem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Tổng quan</SelectItem>
              <SelectItem value="detailed">Chi tiết</SelectItem>
              <SelectItem value="progress">Tiến độ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {timeFilteredCustomers.length} trong khoảng thời gian đã chọn
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} / {stats.total} khách hàng
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiến độ trung bình</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.avgProgress.toFixed(1)}%
            </div>
            <Progress value={stats.avgProgress} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách tiềm năng</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.potential}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? ((stats.potential / stats.total) * 100).toFixed(1) : 0}% tổng số
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Day Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Tiến Độ Theo Từng Ngày
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dayProgress.map((day) => {
              const percentage = day.total > 0 ? (day.completed / day.total) * 100 : 0;
              
              return (
                <div key={day.day} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Ngày {day.day}</Badge>
                      <span className="text-sm font-medium">
                        {day.completed} / {day.total}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed View */}
      {viewType === 'detailed' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Phân Bố Trạng Thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Hoàn thành</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stats.completed}</span>
                  <Badge className="bg-green-100 text-green-800">
                    {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Đang thực hiện</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stats.active}</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Tiềm năng</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stats.potential}</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {stats.total > 0 ? ((stats.potential / stats.total) * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt Động Gần Đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customers
                  .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                  .slice(0, 5)
                  .map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{customer.name}</p>
                        <p className="text-xs text-gray-500">
                          Cập nhật: {new Date(customer.lastUpdated).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {customer.totalProgress.toFixed(0)}%
                        </Badge>
                        {customer.isPotential && (
                          <Star className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  ))}
                
                {customers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Chưa có dữ liệu khách hàng</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Nhận Xét & Đề Xuất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.avgProgress < 30 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-800">Cần cải thiện</span>
                </div>
                <p className="text-sm text-red-700">
                  Tiến độ trung bình thấp. Cần tăng cường theo dõi và hỗ trợ khách hàng.
                </p>
              </div>
            )}
            
            {stats.potential / stats.total > 0.3 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Hiệu quả cao</span>
                </div>
                <p className="text-sm text-green-700">
                  Tỷ lệ khách tiềm năng cao ({((stats.potential / stats.total) * 100).toFixed(1)}%). Đang làm việc hiệu quả!
                </p>
              </div>
            )}
            
            {stats.completed / stats.total > 0.5 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Tiến độ tốt</span>
                </div>
                <p className="text-sm text-blue-700">
                  Tỷ lệ hoàn thành cao ({((stats.completed / stats.total) * 100).toFixed(1)}%). Duy trì phong độ!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
