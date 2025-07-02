/**
 * Modal hiển thị danh sách thành viên trong nhóm
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { 
  Users, 
  Crown, 
  Star, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  UserCheck,
  UserX,
  Settings
} from 'lucide-react';

/**
 * Interface cho thông tin thành viên
 */
interface GroupMember {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'leader' | 'member' | 'vip';
  joinDate: string;
  status: 'active' | 'inactive';
  location?: string;
  lastActive: string;
}

/**
 * Interface cho props
 */
interface GroupMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  members: GroupMember[];
  onRemoveMember?: (memberId: string) => void;
  onPromoteMember?: (memberId: string) => void;
}

export default function GroupMemberModal({
  isOpen,
  onClose,
  groupName,
  members,
  onRemoveMember,
  onPromoteMember
}: GroupMemberModalProps) {

  /**
   * Lấy màu cho role
   */
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'leader': return 'bg-yellow-100 text-yellow-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  /**
   * Lấy icon cho role
   */
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'leader': return <Crown className="w-3 h-3" />;
      case 'vip': return <Star className="w-3 h-3" />;
      default: return <Users className="w-3 h-3" />;
    }
  };

  /**
   * Lấy text cho role
   */
  const getRoleText = (role: string) => {
    switch (role) {
      case 'leader': return 'Trưởng nhóm';
      case 'vip': return 'VIP';
      default: return 'Thành viên';
    }
  };

  /**
   * Format ngày tháng
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  /**
   * Tính thời gian hoạt động cuối
   */
  const getLastActiveText = (lastActive: string) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffHours = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Thành viên nhóm: {groupName}
            <Badge className="bg-blue-100 text-blue-800">
              {members.length} người
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Statistics */}
          <div className="grid grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{members.length}</div>
              <div className="text-xs text-gray-600">Tổng số</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {members.filter(m => m.status === 'active').length}
              </div>
              <div className="text-xs text-gray-600">Hoạt động</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {members.filter(m => m.role === 'leader').length}
              </div>
              <div className="text-xs text-gray-600">Trưởng nhóm</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {members.filter(m => m.role === 'vip').length}
              </div>
              <div className="text-xs text-gray-600">VIP</div>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {members.map(member => (
              <div key={member.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <Avatar className="mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                      {member.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Member Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <Badge className={getRoleColor(member.role)}>
                        {getRoleIcon(member.role)}
                        <span className="ml-1">{getRoleText(member.role)}</span>
                      </Badge>
                      {member.status === 'active' ? (
                        <Badge className="bg-green-100 text-green-800">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          <UserX className="w-3 h-3 mr-1" />
                          Không hoạt động
                        </Badge>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                      {member.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Tham gia: {formatDate(member.joinDate)}</span>
                      </div>
                      {member.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{member.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Last Active */}
                    <div className="text-xs text-gray-500">
                      Hoạt động cuối: {getLastActiveText(member.lastActive)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    {member.role !== 'leader' && onPromoteMember && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPromoteMember(member.id)}
                        className="text-xs"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Nâng cấp
                      </Button>
                    )}
                    {member.role !== 'leader' && onRemoveMember && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRemoveMember(member.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        <UserX className="w-3 h-3 mr-1" />
                        Xóa
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      Cài đặt
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {members.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Chưa có thành viên nào trong nhóm</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            Cập nhật lúc: {new Date().toLocaleString('vi-VN')}
          </div>
          <Button onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}