/**
 * Cổng CRM Admin riêng biệt - Quản lý toàn bộ hệ thống
 * Tách biệt hoàn toàn với web chính
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Settings, 
  Users, 
  Shield, 
  Database, 
  Palette, 
  Key,
  UserPlus,
  Trash2,
  Edit,
  Save,
  Eye,
  EyeOff,
  Building,
  Monitor,
  Globe,
  Code,
  Zap,
  Crown,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Minus
} from 'lucide-react';

/**
 * Interface cho system config
 */
interface SystemConfig {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  logoUrl: string;
  maxUsers: number;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  sessionTimeout: number;
  maintenanceMode: boolean;
  contactInfo: {
    zalo: string;
    telegram: string;
    whatsapp: string;
    email: string;
  };
  features: {
    enableCustomerManagement: boolean;
    enableAnalytics: boolean;
    enablePsychologyAnalysis: boolean;
    enableDocuments: boolean;
    enableGroupManagement: boolean;
  };
}

export default function AdminCRM() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoginData, setAdminLoginData] = useState({ username: '', key: '' });
  const [adminLoginError, setAdminLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [passwords, setPasswords] = useState<any>({});
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    siteName: 'Hệ Thống CRM',
    siteDescription: 'Quản lý khách hàng chuyên nghiệp',
    primaryColor: '#3b82f6',
    logoUrl: '',
    maxUsers: 100,
    allowRegistration: false,
    requireEmailVerification: false,
    sessionTimeout: 24,
    maintenanceMode: false,
    contactInfo: {
      zalo: 'https://zalo.me/+84777574537',
      telegram: 'https://t.me/Qi_266',
      whatsapp: 'https://wa.me/+84777333038',
      email: 'admin@company.com'
    },
    features: {
      enableCustomerManagement: true,
      enableAnalytics: true,
      enablePsychologyAnalysis: true,
      enableDocuments: true,
      enableGroupManagement: true
    }
  });
  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'employee',
    password: '',
    groupId: ''
  });
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: ''
  });
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  /**
   * Load dữ liệu khi component mount
   */
  useEffect(() => {
    // Kiểm tra admin đã đăng nhập chưa
    const savedAdminAuth = localStorage.getItem('adminAuthenticated');
    if (savedAdminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
    
    loadSystemData();
    loadSystemConfig();
  }, []);

  /**
   * Xác thực admin
   */
  const authenticateAdmin = () => {
    const { username, key } = adminLoginData;
    
    if (username === 'xiaohei88' && key === '17122004') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setAdminLoginError('');
    } else {
      setAdminLoginError('Tài khoản hoặc key không chính xác!');
    }
  };

  /**
   * Đăng xuất admin
   */
  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setAdminLoginData({ username: '', key: '' });
  };

  /**
   * Load dữ liệu hệ thống
   */
  const loadSystemData = () => {
    const savedUsers = localStorage.getItem('users');
    const savedGroups = localStorage.getItem('groups');
    const savedPasswords = localStorage.getItem('passwords');
    
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedGroups) setGroups(JSON.parse(savedGroups));
    if (savedPasswords) setPasswords(JSON.parse(savedPasswords));
  };

  /**
   * Load cấu hình hệ thống
   */
  const loadSystemConfig = () => {
    const savedConfig = localStorage.getItem('systemConfig');
    if (savedConfig) {
      setSystemConfig({ ...systemConfig, ...JSON.parse(savedConfig) });
    }
  };

  /**
   * Lưu cấu hình hệ thống
   */
  const saveSystemConfig = () => {
    localStorage.setItem('systemConfig', JSON.stringify(systemConfig));
    alert('Đã lưu cấu hình hệ thống!');
  };

  /**
   * Tạo user mới
   */
  const createUser = () => {
    if (!newUser.username || !newUser.password || !newUser.fullName) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (users.find(u => u.username === newUser.username)) {
      alert('Tên đăng nhập đã tồn tại!');
      return;
    }

    const user = {
      id: `${newUser.role}_${Date.now()}`,
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      groupId: newUser.groupId || undefined,
      accessKey: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const updatedUsers = [...users, user];
    const updatedPasswords = { ...passwords, [newUser.username]: newUser.password };

    setUsers(updatedUsers);
    setPasswords(updatedPasswords);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('passwords', JSON.stringify(updatedPasswords));

    setNewUser({
      username: '',
      fullName: '',
      email: '',
      role: 'employee',
      password: '',
      groupId: ''
    });

    alert('Tạo user thành công!');
  };

  /**
   * Xóa user
   */
  const deleteUser = (userId: string, username: string) => {
    if (!confirm(`Bạn có chắc muốn xóa user "${username}"?`)) return;

    const updatedUsers = users.filter(u => u.id !== userId);
    const updatedPasswords = { ...passwords };
    delete updatedPasswords[username];

    setUsers(updatedUsers);
    setPasswords(updatedPasswords);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('passwords', JSON.stringify(updatedPasswords));

    alert('Đã xóa user!');
  };

  /**
   * Toggle user active status
   */
  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  /**
   * Tạo group mới
   */
  const createGroup = () => {
    if (!newGroup.name) {
      alert('Vui lòng nhập tên nhóm!');
      return;
    }

    const group = {
      id: `group_${Date.now()}`,
      name: newGroup.name,
      description: newGroup.description,
      managerId: 'manager_001', // Default manager
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const updatedGroups = [...groups, group];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));

    setNewGroup({ name: '', description: '' });
    alert('Tạo nhóm thành công!');
  };

  /**
   * Xóa group
   */
  const deleteGroup = (groupId: string, groupName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa nhóm "${groupName}"?`)) return;

    const updatedGroups = groups.filter(g => g.id !== groupId);
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));

    alert('Đã xóa nhóm!');
  };

  /**
   * Reset toàn bộ hệ thống
   */
  const resetSystem = () => {
    if (!confirm('CẢNH BÁO: Bạn có chắc muốn reset toàn bộ hệ thống? Tất cả dữ liệu sẽ bị xóa!')) return;
    if (!confirm('Xác nhận lần cuối: Tất cả users, groups, khách hàng sẽ bị xóa!')) return;

    // Xóa tất cả dữ liệu
    localStorage.clear();
    
    // Tạo lại tài khoản admin mặc định
    const defaultAdmin = {
      id: 'admin_001',
      username: 'admin',
      fullName: 'Super Admin',
      email: 'admin@company.com',
      role: 'manager',
      accessKey: '0000',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    localStorage.setItem('passwords', JSON.stringify({ admin: 'admin123' }));
    
    // Reload lại data
    loadSystemData();
    alert('Đã reset hệ thống! Chỉ còn tài khoản admin mặc định.');
  };

  /**
   * Export dữ liệu
   */
  const exportData = () => {
    const data = {
      users,
      groups,
      passwords,
      systemConfig,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Import dữ liệu
   */
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (confirm('Bạn có chắc muốn import dữ liệu này? Dữ liệu hiện tại sẽ bị ghi đè!')) {
          if (data.users) {
            setUsers(data.users);
            localStorage.setItem('users', JSON.stringify(data.users));
          }
          if (data.groups) {
            setGroups(data.groups);
            localStorage.setItem('groups', JSON.stringify(data.groups));
          }
          if (data.passwords) {
            setPasswords(data.passwords);
            localStorage.setItem('passwords', JSON.stringify(data.passwords));
          }
          if (data.systemConfig) {
            setSystemConfig(data.systemConfig);
            localStorage.setItem('systemConfig', JSON.stringify(data.systemConfig));
          }
          
          alert('Import dữ liệu thành công!');
        }
      } catch (error) {
        alert('File không hợp lệ!');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  // Nếu chưa xác thực admin, hiện form đăng nhập
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Admin Login Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Super Admin Portal
            </h1>
            <p className="text-white/70">
              Truy cập với quyền siêu quản trị viên
            </p>
          </div>

          {/* Admin Login Card */}
          <Card className="bg-black/40 border-white/10 shadow-2xl">
            <CardHeader className="space-y-4 text-center">
              <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-yellow-400" />
                Xác Thực Admin
              </CardTitle>
              <p className="text-white/70 text-sm">
                Nhập tài khoản và key để truy cập hệ thống quản trị
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Admin Username */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Tài khoản Admin</label>
                <div className="relative">
                  <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Nhập tài khoản admin..."
                    value={adminLoginData.username}
                    onChange={(e) => setAdminLoginData({...adminLoginData, username: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && authenticateAdmin()}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Admin Key */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Access Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 w-4 h-4" />
                  <Input
                    type="password"
                    placeholder="Nhập access key..."
                    value={adminLoginData.key}
                    onChange={(e) => setAdminLoginData({...adminLoginData, key: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && authenticateAdmin()}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Error Alert */}
              {adminLoginError && (
                <Alert className="bg-red-500/10 border-red-500/30">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    {adminLoginError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                onClick={authenticateAdmin}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium h-12"
              >
                <Shield className="w-4 h-4 mr-2" />
                Đăng Nhập Admin
              </Button>

              {/* Back to Main */}
              <Button
                variant="outline"
                onClick={() => window.location.hash = '/'}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Globe className="w-4 h-4 mr-2" />
                Quay Lại Trang Chính
              </Button>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-xs">
                Khu vực hạn chế - Chỉ dành cho Super Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Super Admin CRM</h1>
              <p className="text-sm text-white/70">Quản lý toàn bộ hệ thống</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Admin Only
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={logoutAdmin}
              className="border-red-500/20 text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng Xuất Admin
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.hash = '/'}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Globe className="w-4 h-4 mr-2" />
              Về Trang Chính
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 mb-6 bg-black/20 border-white/10">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-white/20">
              <Monitor className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-white/20">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-white data-[state=active]:bg-white/20">
              <Building className="w-4 h-4 mr-2" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="config" className="text-white data-[state=active]:bg-white/20">
              <Settings className="w-4 h-4 mr-2" />
              Cấu Hình
            </TabsTrigger>
            <TabsTrigger value="database" className="text-white data-[state=active]:bg-white/20">
              <Database className="w-4 h-4 mr-2" />
              Database
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-white data-[state=active]:bg-white/20">
              <Palette className="w-4 h-4 mr-2" />
              Giao Diện
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-black/40 border-white/10 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{users.length}</div>
                      <div className="text-sm text-white/70">Tổng Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/10 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{users.filter(u => u.isActive).length}</div>
                      <div className="text-sm text-white/70">Users Hoạt Động</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/10 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{groups.length}</div>
                      <div className="text-sm text-white/70">Nhóm</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/10 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                      <Crown className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{users.filter(u => u.role === 'manager').length}</div>
                      <div className="text-sm text-white/70">Managers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Trạng Thái Hệ Thống
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Hệ thống hoạt động</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Database className="w-4 h-4" />
                      <span>Database</span>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-300">Connected</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Thao Tác Nhanh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    className="h-20 flex-col gap-2 bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-300"
                    onClick={() => setActiveTab('users')}
                  >
                    <UserPlus className="w-6 h-6" />
                    <span>Tạo User</span>
                  </Button>
                  
                  <Button 
                    className="h-20 flex-col gap-2 bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-300"
                    onClick={exportData}
                  >
                    <Download className="w-6 h-6" />
                    <span>Export Data</span>
                  </Button>
                  
                  <Button 
                    className="h-20 flex-col gap-2 bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30 text-purple-300"
                    onClick={() => setActiveTab('config')}
                  >
                    <Settings className="w-6 h-6" />
                    <span>Cấu Hình</span>
                  </Button>
                  
                  <Button 
                    className="h-20 flex-col gap-2 bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300"
                    onClick={resetSystem}
                  >
                    <RefreshCw className="w-6 h-6" />
                    <span>Reset System</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Create User */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Tạo User Mới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white text-sm mb-2 block">Username:</label>
                    <Input 
                      placeholder="Tên đăng nhập"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white text-sm mb-2 block">Họ tên:</label>
                    <Input 
                      placeholder="Họ và tên"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white text-sm mb-2 block">Email:</label>
                    <Input 
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white text-sm mb-2 block">Role:</label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-white text-sm mb-2 block">Nhóm:</label>
                    <Select value={newUser.groupId} onValueChange={(value) => setNewUser({...newUser, groupId: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Chọn nhóm" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map(group => (
                          <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-white text-sm mb-2 block">Mật khẩu:</label>
                    <Input 
                      type="password"
                      placeholder="Mật khẩu"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                
                <Button onClick={createUser} className="bg-green-500 hover:bg-green-600">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Tạo User
                </Button>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Danh Sách Users ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          user.role === 'manager' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {user.role === 'manager' ? <Crown className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.fullName}</div>
                          <div className="text-white/70 text-sm">@{user.username} • {user.role}</div>
                          <div className="text-white/50 text-xs">{user.email}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <div className="text-white/70">
                            Mật khẩu: {showPasswords[user.username] ? passwords[user.username] : '••••••••'}
                          </div>
                          <div className="text-white/50">Access Key: {user.accessKey}</div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPasswords({...showPasswords, [user.username]: !showPasswords[user.username]})}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          {showPasswords[user.username] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                          className={`border-white/20 ${user.isActive ? 'text-green-400 hover:bg-green-500/10' : 'text-red-400 hover:bg-red-500/10'}`}
                        >
                          {user.isActive ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteUser(user.id, user.username)}
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            {/* Create Group */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Tạo Nhóm Mới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm mb-2 block">Tên nhóm:</label>
                    <Input 
                      placeholder="Tên nhóm"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white text-sm mb-2 block">Mô tả:</label>
                    <Input 
                      placeholder="Mô tả nhóm"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                
                <Button onClick={createGroup} className="bg-green-500 hover:bg-green-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo Nhóm
                </Button>
              </CardContent>
            </Card>

            {/* Groups List */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Danh Sách Nhóm ({groups.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groups.map(group => (
                    <div key={group.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{group.name}</div>
                          <div className="text-white/70 text-sm">{group.description}</div>
                          <div className="text-white/50 text-xs">
                            {users.filter(u => u.groupId === group.id).length} thành viên
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteGroup(group.id, group.name)}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Cấu Hình Hệ Thống
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Thông Tin Cơ Bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm mb-2 block">Tên hệ thống:</label>
                      <Input 
                        value={systemConfig.siteName}
                        onChange={(e) => setSystemConfig({...systemConfig, siteName: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Mô tả:</label>
                      <Input 
                        value={systemConfig.siteDescription}
                        onChange={(e) => setSystemConfig({...systemConfig, siteDescription: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Thông Tin Liên Hệ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm mb-2 block">Zalo:</label>
                      <Input 
                        value={systemConfig.contactInfo.zalo}
                        onChange={(e) => setSystemConfig({
                          ...systemConfig, 
                          contactInfo: {...systemConfig.contactInfo, zalo: e.target.value}
                        })}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Telegram:</label>
                      <Input 
                        value={systemConfig.contactInfo.telegram}
                        onChange={(e) => setSystemConfig({
                          ...systemConfig, 
                          contactInfo: {...systemConfig.contactInfo, telegram: e.target.value}
                        })}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Tính Năng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(systemConfig.features).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white">{key.replace('enable', '').replace(/([A-Z])/g, ' $1')}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSystemConfig({
                            ...systemConfig,
                            features: {...systemConfig.features, [key]: !value}
                          })}
                          className={`${value ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}`}
                        >
                          {value ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={saveSystemConfig} className="bg-blue-500 hover:bg-blue-600">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Cấu Hình
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Quản Lý Dữ Liệu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={exportData} className="h-20 flex-col gap-2 bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-300">
                    <Download className="w-6 h-6" />
                    <span>Export Backup</span>
                  </Button>
                  
                  <div>
                    <input 
                      type="file" 
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                      id="import-file"
                    />
                    <Button 
                      onClick={() => document.getElementById('import-file')?.click()}
                      className="w-full h-20 flex-col gap-2 bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-300"
                    >
                      <Upload className="w-6 h-6" />
                      <span>Import Backup</span>
                    </Button>
                  </div>
                  
                  <Button onClick={resetSystem} className="h-20 flex-col gap-2 bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300">
                    <RefreshCw className="w-6 h-6" />
                    <span>Reset System</span>
                  </Button>
                </div>

                <Alert className="bg-yellow-500/10 border-yellow-500/30">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-300">
                    Cẩn thận khi thực hiện các thao tác với database. Luôn backup trước khi thay đổi!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Tùy Chỉnh Giao Diện
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <Palette className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">Đang Phát Triển</h3>
                  <p className="text-white/70">Tính năng tùy chỉnh giao diện sẽ được cập nhật trong phiên bản tiếp theo</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
