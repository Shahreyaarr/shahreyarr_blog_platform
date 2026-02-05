import { useState } from 'react';
import { useBlogStore } from '@/store';
import type { BlogContentBlock } from '@/types';
import AdminLayout from './AdminLayout';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Underline,
  Image as ImageIcon,
  Video,
  Quote,
  List,
  Heading,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const AdminBlogs = () => {
  const { blogs, categories, addBlog, updateBlog, deleteBlog } = useBlogStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<typeof blogs[0] | null>(null);
  const [contentBlocks, setContentBlocks] = useState<BlogContentBlock[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    author: 'Sahr E Yaar',
    read_time: '',
    category: '',
    country: '',
    state: '',
    tags: '',
    featured_image: '',
    seo_title: '',
    seo_description: '',
    is_published: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      author: 'Sahr E Yaar',
      read_time: '',
      category: '',
      country: '',
      state: '',
      tags: '',
      featured_image: '',
      seo_title: '',
      seo_description: '',
      is_published: true,
    });
    setContentBlocks([]);
    setEditingBlog(null);
  };

  const handleEdit = (blog: typeof blogs[0]) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      author: blog.author,
      read_time: blog.read_time,
      category: blog.category,
      country: blog.country || '',
      state: blog.state || '',
      tags: blog.tags.join(', '),
      featured_image: blog.featured_image,
      seo_title: blog.seo_title || '',
      seo_description: blog.seo_description || '',
      is_published: blog.is_published,
    });
    setContentBlocks(blog.content);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const blogData = {
      ...formData,
      content: contentBlocks,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (editingBlog) {
      updateBlog(editingBlog.id, blogData);
    } else {
      addBlog(blogData as Parameters<typeof addBlog>[0]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(id);
    }
  };

  const addContentBlock = (type: BlogContentBlock['type']) => {
    const newBlock: BlogContentBlock = {
      type,
      content: type === 'heading' ? 'New Heading' : type === 'paragraph' ? 'Start typing...' : '',
      level: type === 'heading' ? 2 : undefined,
      alignment: 'center',
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateBlock = (index: number, updates: Partial<BlogContentBlock>) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    setContentBlocks(newBlocks);
  };

  const removeBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === contentBlocks.length - 1) return;

    const newBlocks = [...contentBlocks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  return (
    <AdminLayout title="Blog Posts">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Manage your blog posts</p>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{blog.title}</h3>
                    {!blog.is_published && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span>{blog.category}</span>
                    <span>•</span>
                    <span>{blog.read_time}</span>
                    <span>•</span>
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(blog)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      updateBlog(blog.id, { is_published: !blog.is_published })
                    }
                  >
                    {blog.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleDelete(blog.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'New Blog Post'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Blog post title"
                />
              </div>

              <div>
                <Label>Excerpt</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of the post"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Read Time</Label>
                  <Input
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    placeholder="e.g., 5 min read"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Country</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g., India"
                  />
                </div>
                <div>
                  <Label>State (optional)</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g., Himachal Pradesh"
                  />
                </div>
              </div>

              <div>
                <Label>Featured Image URL</Label>
                <Input
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label>Tags (comma separated)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="travel, adventure, photography"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
                <Label>Publish immediately</Label>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <Label className="mb-2 block">Content</Label>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-100 rounded-lg">
                <Button type="button" variant="ghost" size="sm" onClick={() => addContentBlock('heading')}>
                  <Heading className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => addContentBlock('paragraph')}>
                  <Type className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => addContentBlock('image')}>
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => addContentBlock('video')}>
                  <Video className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => addContentBlock('quote')}>
                  <Quote className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => addContentBlock('list')}>
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Blocks */}
              <div className="space-y-4">
                {contentBlocks.map((block, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium capitalize">{block.type}</span>
                      <div className="flex-1" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveBlock(index, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveBlock(index, 'down')}
                        disabled={index === contentBlocks.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBlock(index)}
                        className="text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {block.type === 'heading' && (
                      <div className="space-y-2">
                        <Select
                          value={block.level?.toString()}
                          onValueChange={(value) =>
                            updateBlock(index, { level: parseInt(value) })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">H1</SelectItem>
                            <SelectItem value="2">H2</SelectItem>
                            <SelectItem value="3">H3</SelectItem>
                            <SelectItem value="4">H4</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={block.content}
                          onChange={(e) => updateBlock(index, { content: e.target.value })}
                          placeholder="Heading text"
                        />
                      </div>
                    )}

                    {block.type === 'paragraph' && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateBlock(index, {
                                style: { ...block.style, bold: !block.style?.bold },
                              })
                            }
                            className={block.style?.bold ? 'bg-gray-200' : ''}
                          >
                            <Bold className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateBlock(index, {
                                style: { ...block.style, italic: !block.style?.italic },
                              })
                            }
                            className={block.style?.italic ? 'bg-gray-200' : ''}
                          >
                            <Italic className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateBlock(index, {
                                style: { ...block.style, underline: !block.style?.underline },
                              })
                            }
                            className={block.style?.underline ? 'bg-gray-200' : ''}
                          >
                            <Underline className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(index, { content: e.target.value })}
                          placeholder="Enter your text..."
                          rows={4}
                          style={{
                            fontWeight: block.style?.bold ? 'bold' : undefined,
                            fontStyle: block.style?.italic ? 'italic' : undefined,
                            textDecoration: block.style?.underline ? 'underline' : undefined,
                          }}
                        />
                      </div>
                    )}

                    {block.type === 'image' && (
                      <div className="space-y-2">
                        <Input
                          value={block.url}
                          onChange={(e) => updateBlock(index, { url: e.target.value })}
                          placeholder="Image URL"
                        />
                        <Input
                          value={block.caption}
                          onChange={(e) => updateBlock(index, { caption: e.target.value })}
                          placeholder="Caption (optional)"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={block.alignment === 'left' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateBlock(index, { alignment: 'left' })}
                          >
                            <AlignLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant={block.alignment === 'center' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateBlock(index, { alignment: 'center' })}
                          >
                            <AlignCenter className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant={block.alignment === 'right' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateBlock(index, { alignment: 'right' })}
                          >
                            <AlignRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {block.type === 'video' && (
                      <div className="space-y-2">
                        <Input
                          value={block.url}
                          onChange={(e) => updateBlock(index, { url: e.target.value })}
                          placeholder="YouTube embed URL"
                        />
                      </div>
                    )}

                    {block.type === 'quote' && (
                      <Textarea
                        value={block.content}
                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                        placeholder="Enter quote..."
                        rows={3}
                      />
                    )}

                    {block.type === 'list' && (
                      <Textarea
                        value={block.items?.join('\n')}
                        onChange={(e) =>
                          updateBlock(index, { items: e.target.value.split('\n') })
                        }
                        placeholder="Enter items (one per line)"
                        rows={4}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">SEO Settings</h4>
              <div className="space-y-4">
                <div>
                  <Label>SEO Title</Label>
                  <Input
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    placeholder="Custom title for search engines"
                  />
                </div>
                <div>
                  <Label>SEO Description</Label>
                  <Textarea
                    value={formData.seo_description}
                    onChange={(e) =>
                      setFormData({ ...formData, seo_description: e.target.value })
                    }
                    placeholder="Meta description for search engines"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                {editingBlog ? 'Update Post' : 'Publish Post'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBlogs;
