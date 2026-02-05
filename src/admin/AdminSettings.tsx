import { useState } from 'react';
import { useSettingsStore } from '@/store';
import AdminLayout from './AdminLayout';
import { Save, User, Globe, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminSettings = () => {
  const { settings, user, stats, updateSettings, updateUser, updateStats } = useSettingsStore();
  const [activeTab, setActiveTab] = useState('site');

  const [siteForm, setSiteForm] = useState(settings);
  const [userForm, setUserForm] = useState(user);
  const [statsForm, setStatsForm] = useState(stats);

  const handleSaveSite = () => updateSettings(siteForm);
  const handleSaveUser = () => updateUser(userForm);
  const handleSaveStats = () => updateStats(statsForm);

  return (
    <AdminLayout title="Settings">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="site"><Globe className="w-4 h-4 mr-2" />Site</TabsTrigger>
          <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="stats"><BarChart3 className="w-4 h-4 mr-2" />Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <Card>
            <CardHeader><CardTitle>Site Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Site Title</Label><Input value={siteForm.site_title} onChange={(e) => setSiteForm({ ...siteForm, site_title: e.target.value })} /></div>
              <div><Label>Site Description</Label><Input value={siteForm.site_description} onChange={(e) => setSiteForm({ ...siteForm, site_description: e.target.value })} /></div>
              <div><Label>Hero Title</Label><Input value={siteForm.hero_title} onChange={(e) => setSiteForm({ ...siteForm, hero_title: e.target.value })} /></div>
              <div><Label>Hero Subtitle</Label><Input value={siteForm.hero_subtitle} onChange={(e) => setSiteForm({ ...siteForm, hero_subtitle: e.target.value })} /></div>
              <div><Label>Contact Email</Label><Input type="email" value={siteForm.contact_email} onChange={(e) => setSiteForm({ ...siteForm, contact_email: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={siteForm.location} onChange={(e) => setSiteForm({ ...siteForm, location: e.target.value })} /></div>
              <div><Label>Hero Images (one per line)</Label><Textarea value={siteForm.hero_images.join('\n')} onChange={(e) => setSiteForm({ ...siteForm, hero_images: e.target.value.split('\n').filter(Boolean) })} rows={4} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={siteForm.hero_slider_enabled} onCheckedChange={(c) => setSiteForm({ ...siteForm, hero_slider_enabled: c })} />
                <Label>Enable hero slider</Label>
              </div>
              <Button onClick={handleSaveSite}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Name</Label><Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} /></div>
              <div><Label>Title</Label><Input value={userForm.title || ''} onChange={(e) => setUserForm({ ...userForm, title: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={userForm.location || ''} onChange={(e) => setUserForm({ ...userForm, location: e.target.value })} /></div>
              <div><Label>Bio</Label><Textarea value={userForm.bio || ''} onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })} rows={4} /></div>
              <div><Label>Avatar URL</Label><Input value={userForm.avatar || ''} onChange={(e) => setUserForm({ ...userForm, avatar: e.target.value })} /></div>
              <div><Label>Instagram</Label><Input value={userForm.social_links.instagram || ''} onChange={(e) => setUserForm({ ...userForm, social_links: { ...userForm.social_links, instagram: e.target.value } })} /></div>
              <div><Label>Twitter</Label><Input value={userForm.social_links.twitter || ''} onChange={(e) => setUserForm({ ...userForm, social_links: { ...userForm.social_links, twitter: e.target.value } })} /></div>
              <div><Label>YouTube</Label><Input value={userForm.social_links.youtube || ''} onChange={(e) => setUserForm({ ...userForm, social_links: { ...userForm.social_links, youtube: e.target.value } })} /></div>
              <Button onClick={handleSaveUser}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader><CardTitle>Travel Statistics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Total Distance (km)</Label><Input type="number" value={statsForm.total_distance_km} onChange={(e) => setStatsForm({ ...statsForm, total_distance_km: parseInt(e.target.value) || 0 })} /></div>
                <div><Label>Countries Visited</Label><Input type="number" value={statsForm.countries_visited} onChange={(e) => setStatsForm({ ...statsForm, countries_visited: parseInt(e.target.value) || 0 })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>States Covered</Label><Input type="number" value={statsForm.states_covered} onChange={(e) => setStatsForm({ ...statsForm, states_covered: parseInt(e.target.value) || 0 })} /></div>
                <div><Label>Cities Explored</Label><Input type="number" value={statsForm.cities_explored} onChange={(e) => setStatsForm({ ...statsForm, cities_explored: parseInt(e.target.value) || 0 })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Total Photos</Label><Input type="number" value={statsForm.total_photos} onChange={(e) => setStatsForm({ ...statsForm, total_photos: parseInt(e.target.value) || 0 })} /></div>
                <div><Label>Total Blogs</Label><Input type="number" value={statsForm.total_blogs} onChange={(e) => setStatsForm({ ...statsForm, total_blogs: parseInt(e.target.value) || 0 })} /></div>
              </div>
              <Button onClick={handleSaveStats}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;
