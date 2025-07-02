/**
 * Component tài liệu nâng cao - dành cho cả Manager và Employee
 * Cung cấp tài liệu đào tạo, hướng dẫn và tài nguyên hỗ trợ
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Search,
  Star,
  Clock,
  Users,
  PlayCircle,
  ExternalLink,
  BookMarked,
  Lightbulb,
  Target,
  Award,
  CheckCircle,
  Lock,
  Eye,
  Plus,
  Save,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

/**
 * Interface cho Document
 */
interface Document {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'template' | 'faq';
  category: 'sales' | 'system' | 'training' | 'best-practices';
  url?: string;
  downloadUrl?: string;
  duration?: string;
  views: number;
  rating: number;
  isNew: boolean;
  isPremium: boolean;
  createdAt: string;
  createdBy: string; // User ID tạo tài liệu
  groupId?: string; // Group ID để kiểm soát quyền truy cập
  isPublic: boolean; // Tài liệu công khai hay chỉ cho nhóm
}

export default function AdvancedDocuments() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('');
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [customDocuments, setCustomDocuments] = useState<Document[]>([]);
  
  // Form state cho thêm tài liệu
  const [newDocument, setNewDocument] = useState({
    title: '',
    description: '',
    type: 'guide' as Document['type'],
    category: 'sales' as Document['category'],
    url: '',
    duration: '',
    isPremium: false,
    isPublic: false
  });

  /**
   * Load custom documents từ localStorage
   */
  React.useEffect(() => {
    const savedDocs = localStorage.getItem('customDocuments');
    if (savedDocs) {
      setCustomDocuments(JSON.parse(savedDocs));
    }
  }, []);

  /**
   * Dữ liệu tài liệu mặc định + custom documents
   */
  const defaultDocuments: Document[] = [
    {
      id: '1',
      title: 'Kinh nghiệm giao tiếp & Thao Túng',
      description: 'Tài liệu chuyên sâu về kỹ năng giao tiếp và các phương pháp thao túng tâm lý trong trò chuyện',
      type: 'guide',
      category: 'sales',
      url: 'https://drive.google.com/drive/folders/1aJYpaygaUg7PB5BJAX5G5QoN3eVES-HL?usp=sharing',
      duration: 'Nhiều tài liệu',
      views: 1247,
      rating: 4.9,
      isNew: true,
      isPremium: true,
      createdAt: '2024-01-20',
      createdBy: 'system',
      isPublic: true
    }
  ];

  // Kết hợp tài liệu mặc định và custom
  const allDocuments = [...defaultDocuments, ...customDocuments];

  /**
   * Lọc tài liệu theo quyền truy cập
   */
  const getAccessibleDocuments = () => {
    return allDocuments.filter(doc => {
      // Tài liệu công khai -> ai cũng xem được
      if (doc.isPublic) return true;
      
      // Tài liệu do mình tạo -> xem được
      if (doc.createdBy === currentUser?.id) return true;
      
      // Tài liệu trong cùng nhóm -> xem được (nếu có groupId)
      if (doc.groupId && currentUser?.groupId === doc.groupId) return true;
      
      // Mặc định không xem được
      return false;
    });
  };

  const documents = getAccessibleDocuments();

  /**
   * Lọc tài liệu theo tìm kiếm và filter
   */
  const getFilteredDocuments = () => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchesType = selectedType === 'all' || doc.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  };

  /**
   * Lấy icon theo type
   */
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'template': return <FileText className="w-4 h-4" />;
      case 'faq': return <Lightbulb className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  /**
   * Lấy màu sắc badge theo category
   */
  const getCategoryBadge = (category: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      'sales': { label: 'Bán Hàng', className: 'bg-green-100 text-green-700' },
      'system': { label: 'Hệ Thống', className: 'bg-blue-100 text-blue-700' },
      'training': { label: 'Đào Tạo', className: 'bg-purple-100 text-purple-700' },
      'best-practices': { label: 'Best Practices', className: 'bg-orange-100 text-orange-700' }
    };
    
    const config = configs[category];
    return (
      <Badge className={config.className} variant="secondary">
        {config.label}
      </Badge>
    );
  };

  /**
   * Lấy label type
   */
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'guide': 'Hướng Dẫn',
      'video': 'Video',
      'template': 'Mẫu',
      'faq': 'FAQ'
    };
    return labels[type] || type;
  };

  /**
   * Xử lý click vào tài liệu - yêu cầu mật khẩu
   */
  const handleDocumentClick = (doc: Document) => {
    setSelectedDocumentUrl(doc.url || '');
    setIsPasswordDialogOpen(true);
  };

  /**
   * Xử lý submit mật khẩu
   */
  const handlePasswordSubmit = () => {
    if (password === '20042004') {
      // Mật khẩu đúng - mở link Google Drive
      window.open(selectedDocumentUrl, '_blank');
      setIsPasswordDialogOpen(false);
      setPassword('');
      setSelectedDocumentUrl('');
    } else {
      alert('Mật khẩu không chính xác!');
    }
  };

  /**
   * Thêm tài liệu mới
   */
  const handleAddDocument = () => {
    if (!newDocument.title.trim() || !newDocument.description.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const document: Document = {
      id: Date.now().toString(),
      title: newDocument.title,
      description: newDocument.description,
      type: newDocument.type,
      category: newDocument.category,
      url: newDocument.url,
      duration: newDocument.duration || 'Không xác định',
      views: 0,
      rating: 5.0,
      isNew: true,
      isPremium: newDocument.isPremium,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || 'unknown',
      groupId: currentUser?.groupId,
      isPublic: newDocument.isPublic
    };

    const updatedDocs = [...customDocuments, document];
    setCustomDocuments(updatedDocs);
    localStorage.setItem('customDocuments', JSON.stringify(updatedDocs));

    // Reset form
    setNewDocument({
      title: '',
      description: '',
      type: 'guide',
      category: 'sales',
      url: '',
      duration: '',
      isPremium: false,
      isPublic: false
    });

    setIsAddDocumentOpen(false);
    alert('Thêm tài liệu thành công!');
  };

  /**
   * Xóa tài liệu (chỉ Manager và người tạo)
   */
  const handleDeleteDocument = (docId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài liệu này?')) return;

    const updatedDocs = customDocuments.filter(doc => doc.id !== docId);
    setCustomDocuments(updatedDocs);
    localStorage.setItem('customDocuments', JSON.stringify(updatedDocs));
    alert('Đã xóa tài liệu!');
  };

  /**
   * Kiểm tra quyền chỉnh sửa/xóa tài liệu
   */
  const canEditDocument = (doc: Document) => {
    return currentUser?.role === 'manager' || doc.createdBy === currentUser?.id;
  };

  /**
   * Render rating stars
   */
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-3 h-3 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tài Liệu Nâng Cao</h2>
          <p className="text-gray-600">Tài nguyên đào tạo và hướng dẫn chuyên nghiệp</p>
        </div>

        <div className="flex gap-4 items-center">
          {/* Add Document Button - Chỉ Manager */}
          {currentUser?.role === 'manager' && (
            <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Thêm Tài Liệu
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm Tài Liệu Mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tiêu đề *</Label>
                      <Input
                        placeholder="Nhập tiêu đề tài liệu..."
                        value={newDocument.title}
                        onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Thời lượng</Label>
                      <Input
                        placeholder="VD: 30 phút, 5 trang..."
                        value={newDocument.duration}
                        onChange={(e) => setNewDocument({ ...newDocument, duration: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Mô tả *</Label>
                    <Textarea
                      placeholder="Mô tả nội dung tài liệu..."
                      value={newDocument.description}
                      onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Loại tài liệu</Label>
                      <Select 
                        value={newDocument.type} 
                        onValueChange={(value: Document['type']) => setNewDocument({ ...newDocument, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guide">Hướng Dẫn</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="template">Template</SelectItem>
                          <SelectItem value="faq">FAQ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Danh mục</Label>
                      <Select 
                        value={newDocument.category} 
                        onValueChange={(value: Document['category']) => setNewDocument({ ...newDocument, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Bán Hàng</SelectItem>
                          <SelectItem value="system">Hệ Thống</SelectItem>
                          <SelectItem value="training">Đào Tạo</SelectItem>
                          <SelectItem value="best-practices">Best Practices</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Link tài liệu</Label>
                    <Input
                      placeholder="Google Drive, OneDrive, hoặc link khác..."
                      value={newDocument.url}
                      onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPremium"
                        checked={newDocument.isPremium}
                        onChange={(e) => setNewDocument({ ...newDocument, isPremium: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="isPremium">Tài liệu Premium</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={newDocument.isPublic}
                        onChange={(e) => setNewDocument({ ...newDocument, isPublic: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="isPublic">Công khai cho tất cả</Label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddDocument} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Thêm Tài Liệu
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddDocumentOpen(false)}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <Tabs defaultValue="all-docs" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all-docs" onClick={() => { setSelectedCategory('all'); setSelectedType('all'); }}>
            Tất Cả
          </TabsTrigger>
          <TabsTrigger value="guides" onClick={() => setSelectedType('guide')}>
            <BookOpen className="w-4 h-4 mr-1" />
            Hướng Dẫn
          </TabsTrigger>
          <TabsTrigger value="videos" onClick={() => setSelectedType('video')}>
            <Video className="w-4 h-4 mr-1" />
            Video
          </TabsTrigger>
          <TabsTrigger value="templates" onClick={() => setSelectedType('template')}>
            <FileText className="w-4 h-4 mr-1" />
            Template
          </TabsTrigger>
          <TabsTrigger value="sales" onClick={() => { setSelectedCategory('sales'); setSelectedType('all'); }}>
            <Target className="w-4 h-4 mr-1" />
            Bán Hàng
          </TabsTrigger>
          <TabsTrigger value="training" onClick={() => { setSelectedCategory('training'); setSelectedType('all'); }}>
            <Award className="w-4 h-4 mr-1" />
            Đào Tạo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-docs" className="mt-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{documents.filter(d => d.type === 'guide').length}</div>
                <div className="text-sm text-gray-600">Hướng Dẫn</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Video className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{documents.filter(d => d.type === 'video').length}</div>
                <div className="text-sm text-gray-600">Video</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{documents.filter(d => d.type === 'template').length}</div>
                <div className="text-sm text-gray-600">Template</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{documents.reduce((sum, d) => sum + d.views, 0)}</div>
                <div className="text-sm text-gray-600">Lượt Xem</div>
              </CardContent>
            </Card>
          </div>

          {/* Documents Grid */}
          {getFilteredDocuments().length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookMarked className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy tài liệu</h3>
                <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredDocuments().map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(doc.type)}
                        <div className="flex flex-wrap gap-1">
                          {getCategoryBadge(doc.category)}
                          {doc.isNew && (
                            <Badge className="bg-red-100 text-red-700" variant="secondary">
                              Mới
                            </Badge>
                          )}
                          {doc.isPremium && (
                            <Badge className="bg-yellow-100 text-yellow-700" variant="secondary">
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{doc.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{doc.description}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {doc.views.toLocaleString()}
                        </div>
                        {doc.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {doc.duration}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      {renderRating(doc.rating)}
                      <span className="text-xs text-gray-500">
                        {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button 
                        onClick={() => handleDocumentClick(doc)}
                        variant="outline"
                        className="flex-1 flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Xem Tài Liệu
                      </Button>
                      
                      {/* Edit/Delete buttons - Chỉ cho Manager hoặc người tạo */}
                      {canEditDocument(doc) && doc.id !== '1' && (
                        <>
                          <Button size="icon" variant="ghost" title="Chỉnh sửa">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            title="Xóa tài liệu"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      
                      <Button size="icon" variant="ghost" title="Đánh dấu yêu thích">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Các tab khác */}
        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredDocuments().map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(doc.type)}
                      <div className="flex flex-wrap gap-1">
                        {getCategoryBadge(doc.category)}
                        {doc.isNew && (
                          <Badge className="bg-red-100 text-red-700" variant="secondary">Mới</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{doc.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{doc.description}</p>
                  <div className="flex items-center justify-between">
                    {renderRating(doc.rating)}
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDocumentClick(doc)}
                      >
                        <Lock className="w-4 h-4 mr-1" />
                        Đọc Ngay
                      </Button>
                      
                      {/* Edit/Delete cho tab guides */}
                      {canEditDocument(doc) && doc.id !== '1' && (
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Tài Liệu Bảo Mật
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nhập Mật Khẩu</h3>
              <p className="text-sm text-gray-600">
                Liên hệ với ADMIN để được cấp mật khẩu.
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Mật khẩu *</label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsPasswordDialogOpen(false);
                  setPassword('');
                  setSelectedDocumentUrl('');
                }}
              >
                Hủy
              </Button>
              <Button onClick={handlePasswordSubmit} disabled={!password.trim()}>
                <Eye className="w-4 h-4 mr-2" />
                Xem Tài Liệu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
