/**
 * Component quản lý người dùng
 * Chỉ dành cho quản lý để thêm, sửa, xóa người dùng
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { 
  UserPlus, 
  Users,
  UserCog,
  User,
  Mail,
  Building,
  Trash2,
  Edit3,
  Shield,
  ShieldCheck,
  Calendar,
  CheckCircle,
  Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getValidSelectValue } from '../utils/selectFixer';

/**
 * Interface cho User data
 */
interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'manager' | 'employee';
  groupId?: string;
  createdAt: string;
  isActive: boolean;
}

/**
 * Interface cho Group data
 */
interface Group {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function UserManagement() {
  const { currentUser, isManager } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    role: 'employee' as 'manager' | 'employee',
    groupId: ''
  });

  /**
   * Load dữ liệu từ localStorage
   */
  useEffect(() => {
    loadUsers();
    loadGroups();
  }, []);

  /**
   * Load danh sách người dùng
   */
  const loadUsers = () => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Tạo dữ liệu mẫu
      const sampleUsers: User[] = [
        {
          id: 'admin',
          username: 'admin',
          email: 'admin@company.com',
          fullName: 'Quản Lý Hệ Thống',
          role: 'manager',
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 'user1',
          username: 'nhanvien1',
          email: 'nhanvien1@company.com',
          fullName: 'Nhân Viên Mẫu',
          role: 'employee',
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ];
      localStorage.setItem('users', JSON.stringify(sampleUsers));
      setUsers(sampleUsers);
    }
  };

  /**
   * Load danh sách nhóm
   */
  const loadGroups = () => {
    const savedGroups = localStorage.getItem('groups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  };

  /**
   * Lưu danh sách người dùng
   */
  const saveUsers = (updatedUsers: User[]) => {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  /**
   * Thêm người dùng mới
   */
  const addUser = () => {
    if (!newUser.username || !newUser.email || !newUser.fullName || !newUser.password) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      groupId: newUser.groupId || undefined,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const updatedUsers = [...users, user];
    saveUsers(updatedUsers);

    // Reset form
    setNewUser({
      username: '',
      email: '',
      fullName: '',
      password: '',
      role: 'employee',
      groupId: ''
    });
    setIsAddDialogOpen(false);
  };

  /**
   * Xóa người dùng
   */
  const deleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('Không thể xóa tài khoản đang đăng nhập!');
      return;
    }

    const updatedUsers = users.filter(user => user.id !== userId);
    saveUsers(updatedUsers);
  };

  /**
   * Lấy tên nhóm
   */
  const getGroupName = (groupId?: string) => {
    if (!groupId) return 'Chưa phân nhóm';
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : 'Nhóm không tồn tại';
  };

  if (!isManager()) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Truy Cập Bị Hạn Chế</h3>
          <p className="text-gray-500">Chỉ quản lý mới có thể truy cập tính năng này</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Quản Lý Người Dùng
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Thêm, sửa, xóa tài khoản người dùng</p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-sm sm:text-base">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Thêm User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Tên đăng nhập *</label>
                        <Input
                          placeholder="username"
                          value={newUser.username}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                          className="h-9 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Email *</label>
                        <Input
                          placeholder="email@company.com"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Họ tên đầy đủ *</label>
                      <Input
                        placeholder="Nguyễn Văn A"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                        className="h-9 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Mật khẩu *</label>
                      <Input
                        placeholder="Nhập mật khẩu"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="h-9 text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Vai trò</label>
                        <Select value={getValidSelectValue(newUser.role, 'employee')} onValueChange={(value: 'manager' | 'employee') => setNewUser({ ...newUser, role: value })}>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employee">Nhân viên</SelectItem>
                            <SelectItem value="manager">Quản lý</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Nhóm</label>
                        <Select value={getValidSelectValue(newUser.groupId, 'none')} onValueChange={(value) => setNewUser({ ...newUser, groupId: value === 'none' ? '' : value })}>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Chưa phân nhóm</SelectItem>
                            {groups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="text-sm">
                      Hủy
                    </Button>
                    <Button onClick={addUser} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm">
                      Thêm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-xs text-gray-600">Tổng số</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {users.filter(u => u.isActive).length}
              </div>
              <div className="text-xs text-gray-600">Hoạt động</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'manager').length}
              </div>
              <div className="text-xs text-gray-600">Quản lý</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">
                {users.filter(u => u.role === 'employee').length}
              </div>
              <div className="text-xs text-gray-600">Nhân viên</div>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        {users.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có người dùng</h3>
              <p className="text-gray-500">Thêm người dùng đầu tiên để bắt đầu</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {users.map((user) => (
              <Card key={user.id} className={`border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 ${
                user.id === currentUser?.id ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                          {user.fullName}
                        </CardTitle>
                        {user.id === currentUser?.id && (
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            Bạn
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Tài khoản:</span>
                      <span className="font-medium">@{user.username}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Vai trò:</span>
                      <Badge variant={user.role === 'manager' ? 'default' : 'secondary'} className="text-xs">
                        {user.role === 'manager' ? (
                          <>
                            <UserCog className="w-3 h-3 mr-1" />
                            Quản Lý
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 mr-1" />
                            Nhân Viên
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Nhóm:</span>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span className="truncate max-w-16">{getGroupName(user.groupId)}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Tạo lúc:</span>
                      <span>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Trạng thái:</span>
                      <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-xs">
                        {user.isActive ? 'Hoạt động' : 'Tạm khóa'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-7 text-xs"
                      onClick={() => setEditingUser(user)}
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Sửa
                    </Button>
                    
                    {user.id !== currentUser?.id && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs px-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa người dùng <strong>{user.fullName}</strong>? 
                              Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUser(user.id)}
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
