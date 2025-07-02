/**
 * Component quản lý thiết bị đăng nhập
 * Hiển thị danh sách thiết bị và cho phép đăng xuất từ xa
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { 
  Smartphone, 
  Monitor, 
  LogOut, 
  Trash2, 
  Shield, 
  Clock,
  MapPin,
  Chrome,
  Wifi,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ui/toast';
import { DeviceSession } from '../utils/deviceManager';

export default function DeviceManagement() {
  const { getUserDevices, logoutDevice, logoutAllDevices, currentDevice } = useAuth();
  const { addToast } = useToast();
  const [devices, setDevices] = useState<DeviceSession[]>([]);

  /**
   * Load danh sách thiết bị
   */
  useEffect(() => {
    loadDevices();
  }, []);

  /**
   * Load devices
   */
  const loadDevices = () => {
    const userDevices = getUserDevices();
    setDevices(userDevices);
  };

  /**
   * Xử lý đăng xuất thiết bị
   */
  const handleLogoutDevice = (deviceId: string, deviceName: string) => {
    logoutDevice(deviceId);
    loadDevices();
    
    addToast({
      type: 'success',
      title: 'Đã đăng xuất thiết bị',
      description: `Thiết bị "${deviceName}" đã được đăng xuất`,
      duration: 4000
    });
  };

  /**
   * Xử lý đăng xuất tất cả thiết bị
   */
  const handleLogoutAllDevices = () => {
    logoutAllDevices();
    
    addToast({
      type: 'warning',
      title: 'Đã đăng xuất tất cả thiết bị',
      description: 'Tất cả phiên đăng nhập đã bị hủy',
      duration: 4000
    });
  };

  /**
   * Lấy icon thiết bị
   */
  const getDeviceIcon = (deviceInfo: string) => {
    if (deviceInfo.includes('Mobile')) {
      return <Smartphone className="w-5 h-5 text-blue-500" />;
    }
    return <Monitor className="w-5 h-5 text-green-500" />;
  };

  /**
   * Lấy màu badge cho trạng thái
   */
  const getDeviceBadge = (device: DeviceSession) => {
    const isCurrentDevice = currentDevice?.id === device.id;
    const lastActivity = new Date(device.lastActivity);
    const now = new Date();
    const timeDiff = now.getTime() - lastActivity.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (isCurrentDevice) {
      return <Badge className="bg-green-100 text-green-700">Thiết bị hiện tại</Badge>;
    } else if (hoursDiff < 1) {
      return <Badge className="bg-blue-100 text-blue-700">Hoạt động</Badge>;
    } else if (hoursDiff < 24) {
      return <Badge variant="secondary">Không hoạt động</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700">Cũ</Badge>;
    }
  };

  /**
   * Format thời gian
   */
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes} phút trước`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} giờ trước`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Quản Lý Thiết Bị
          </h3>
          <p className="text-sm text-gray-600">
            Hiện có {devices.length}/3 thiết bị đang đăng nhập
          </p>
        </div>

        {devices.length > 1 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <LogOut className="w-4 h-4 mr-1" />
                Đăng xuất tất cả
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Xác nhận đăng xuất tất cả thiết bị
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ đăng xuất tất cả {devices.length} thiết bị, bao gồm cả thiết bị hiện tại. 
                  Bạn sẽ cần đăng nhập lại. Bạn có chắc chắn muốn tiếp tục?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogoutAllDevices} className="bg-red-600 hover:bg-red-700">
                  Đăng xuất tất cả
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Warning if near device limit */}
      {devices.length >= 2 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {devices.length === 3 
                  ? 'Đã đạt giới hạn thiết bị (3/3). Đăng nhập thiết bị mới sẽ yêu cầu đăng xuất thiết bị khác.'
                  : `Gần đạt giới hạn thiết bị (${devices.length}/3).`
                }
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Wifi className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có phiên đăng nhập</h3>
              <p className="text-gray-500">Chưa có thiết bị nào đăng nhập</p>
            </CardContent>
          </Card>
        ) : (
          devices.map((device) => {
            const isCurrentDevice = currentDevice?.id === device.id;
            
            return (
              <Card key={device.id} className={`relative ${isCurrentDevice ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(device.deviceInfo)}
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {device.deviceInfo}
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          {device.browser} • {device.os}
                        </p>
                      </div>
                    </div>
                    {getDeviceBadge(device)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Device Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Đăng nhập:</span>
                      <span>{new Date(device.loginTime).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Hoạt động cuối:</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(device.lastActivity)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isCurrentDevice && (
                    <div className="pt-2 border-t">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700">
                            <LogOut className="w-4 h-4 mr-1" />
                            Đăng xuất thiết bị này
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận đăng xuất thiết bị</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn đăng xuất thiết bị "{device.deviceInfo} - {device.browser}"? 
                              Thiết bị này sẽ cần đăng nhập lại để truy cập.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleLogoutDevice(device.id, `${device.deviceInfo} - ${device.browser}`)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Đăng xuất
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  {isCurrentDevice && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-blue-600 font-medium text-center bg-blue-100 p-2 rounded">
                        ✓ Đây là thiết bị bạn đang sử dụng
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Security Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            Mẹo bảo mật
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Đăng xuất khỏi các thiết bị không sử dụng thường xuyên</li>
            <li>• Kiểm tra danh sách thiết bị định kỳ để phát hiện truy cập trái phép</li>
            <li>• Chỉ đăng nhập trên các thiết bị đáng tin cậy</li>
            <li>• Tối đa 3 thiết bị có thể đăng nhập cùng lúc</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
