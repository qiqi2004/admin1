/**
 * Component quản lý nhóm người dùng
 * Chỉ dành cho Manager
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Users, 
  Plus, 
  Settings, 
  UserPlus,
  Shield,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getValidSelectValue } from '../utils/selectFixer';

/**
 * Interface cho Group
 */
interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  createdBy: string;
}

export default function GroupManagement() {
  const { currentUser, isManager } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('none');

  // Chỉ manager mới được truy cập
  if (!isManager()) {
    return null;
  }

  /**
   * Load danh sách groups
   */
  useEffect(() => {
    const savedGroups = localStorage.getItem('groups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  /**
   * Lưu groups vào localStorage
   */
  const saveGroups = (updatedGroups: Group[]) => {
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    setGroups(updatedGroups);
  };

  /**
   * Tạo group mới
   */
  const createGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      description: newGroupDescription.trim(),
      memberCount: 0,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.fullName || 'Manager'
    };

    const updatedGroups = [...groups, newGroup];
    saveGroups(updatedGroups);

    // Reset form
    setNewGroupName('');
    setNewGroupDescription('');
    setIsCreateDialogOpen(false);
  };

  /**
   * Xóa group
   */
  const deleteGroup = (groupId: string) => {
    const updatedGroups = groups.filter(g => g.id !== groupId);
    saveGroups(updatedGroups);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Quản Lý Nhóm
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tạo nhóm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo Nhóm Mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tên nhóm</label>
                  <Input
                    placeholder="Nhập tên nhóm..."
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Mô tả</label>
                  <Input
                    placeholder="Mô tả ngắn về nhóm..."
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={createGroup} disabled={!newGroupName.trim()}>
                    Tạo nhóm
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Group Filter */}
          <div className="flex gap-2">
            <Select value={getValidSelectValue(selectedGroupId, 'none')} onValueChange={setSelectedGroupId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Chọn nhóm để xem chi tiết..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tất cả nhóm</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} ({group.memberCount} thành viên)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Groups List */}
          {groups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="mb-4">Chưa có nhóm nào</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Tạo nhóm đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {groups
                .filter(group => selectedGroupId === 'none' || group.id === selectedGroupId)
                .map((group) => (
                  <div key={group.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <h4 className="font-medium">{group.name}</h4>
                        <Badge variant="secondary">
                          {group.memberCount} thành viên
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm">
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteGroup(group.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {group.description && (
                      <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Tạo bởi: {group.createdBy}</span>
                      <span>{new Date(group.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
