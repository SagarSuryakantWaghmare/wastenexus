'use client';

import { useState } from 'react';
import { 
  Shield, 
  Bell, 
  Globe, 
  Database, 
  Key, 
  Mail, 
  Smartphone, 
  Save, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Users, 
  FileText, 
  Monitor,
  Server,
  Cloud,
  Wifi,
  HardDrive,
  Cpu,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Simple Switch component
interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch = ({ checked = false, onCheckedChange, disabled = false }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={`inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

type SettingsData = {
  systemInfo: {
    version: string;
    lastUpdated: string;
    uptime: string;
    environment: string;
    database: string;
    serverStatus: string;
    backupStatus: string;
    maintenanceWindow: string;
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
      passwordExpiry: number;
    };
    sessionTimeout: number;
    maxLoginAttempts: number;
    ipRestrictions: boolean;
    encryptionLevel: string;
  };
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    systemAlerts: boolean;
    reportNotifications: boolean;
    userActivityAlerts: boolean;
    maintenanceAlerts: boolean;
  };
  systemMetrics: {
    cpu: number;
    memory: number;
    storage: number;
    bandwidth: number;
    activeConnections: number;
    dailyTransactions: number;
  };
};

const mockSettingsData: SettingsData = {
  systemInfo: {
    version: '2.1.4',
    lastUpdated: '2024-01-20',
    uptime: '15 days, 8 hours',
    environment: 'Production',
    database: 'PostgreSQL 15.2',
    serverStatus: 'Healthy',
    backupStatus: 'Last backup: 2 hours ago',
    maintenanceWindow: 'Sunday 2:00 AM - 4:00 AM IST'
  },
  securitySettings: {
    twoFactorEnabled: true,
    passwordPolicy: {
      minLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      passwordExpiry: 90
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    ipRestrictions: true,
    encryptionLevel: 'AES-256'
  },
  notificationSettings: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    systemAlerts: true,
    reportNotifications: true,
    userActivityAlerts: false,
    maintenanceAlerts: true
  },
  systemMetrics: {
    cpu: 65,
    memory: 78,
    storage: 45,
    bandwidth: 32,
    activeConnections: 1240,
    dailyTransactions: 45600
  }
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>(mockSettingsData);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (section: keyof SettingsData, key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Save settings logic here
    setHasChanges(false);
    // Show success message
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-lg text-gray-600">
            Configure system security, notifications, and preferences
          </p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <Button 
              onClick={saveSettings}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">System Status</p>
                <p className="text-lg font-bold text-green-600">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-lg font-bold">{settings.systemInfo.uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-lg font-bold">{settings.systemMetrics.activeConnections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Version</p>
                <p className="text-lg font-bold">v{settings.systemInfo.version}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Authentication & Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Two-Factor Authentication</label>
                    <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch 
                    checked={settings.securitySettings.twoFactorEnabled}
                    onCheckedChange={(value: boolean) => handleSettingChange('securitySettings', 'twoFactorEnabled', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">IP Restrictions</label>
                    <p className="text-sm text-gray-600">Limit access to specific IP ranges</p>
                  </div>
                  <Switch 
                    checked={settings.securitySettings.ipRestrictions}
                    onCheckedChange={(value: boolean) => handleSettingChange('securitySettings', 'ipRestrictions', value)}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Session Timeout (minutes)</label>
                  <Input 
                    type="number" 
                    value={settings.securitySettings.sessionTimeout}
                    onChange={(e) => handleSettingChange('securitySettings', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Max Login Attempts</label>
                  <Input 
                    type="number" 
                    value={settings.securitySettings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('securitySettings', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Password Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Password Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Minimum Length</label>
                  <Input 
                    type="number" 
                    value={settings.securitySettings.passwordPolicy.minLength}
                    onChange={(e) => handleSettingChange('securitySettings', 'passwordPolicy', {
                      ...settings.securitySettings.passwordPolicy,
                      minLength: parseInt(e.target.value)
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Require Special Characters</label>
                  </div>
                  <Switch 
                    checked={settings.securitySettings.passwordPolicy.requireSpecialChars}
                    onCheckedChange={(value: boolean) => handleSettingChange('securitySettings', 'passwordPolicy', {
                      ...settings.securitySettings.passwordPolicy,
                      requireSpecialChars: value
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Require Numbers</label>
                  </div>
                  <Switch 
                    checked={settings.securitySettings.passwordPolicy.requireNumbers}
                    onCheckedChange={(value: boolean) => handleSettingChange('securitySettings', 'passwordPolicy', {
                      ...settings.securitySettings.passwordPolicy,
                      requireNumbers: value
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Require Uppercase</label>
                  </div>
                  <Switch 
                    checked={settings.securitySettings.passwordPolicy.requireUppercase}
                    onCheckedChange={(value: boolean) => handleSettingChange('securitySettings', 'passwordPolicy', {
                      ...settings.securitySettings.passwordPolicy,
                      requireUppercase: value
                    })}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Password Expiry (days)</label>
                  <Input 
                    type="number" 
                    value={settings.securitySettings.passwordPolicy.passwordExpiry}
                    onChange={(e) => handleSettingChange('securitySettings', 'passwordPolicy', {
                      ...settings.securitySettings.passwordPolicy,
                      passwordExpiry: parseInt(e.target.value)
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Status */}
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Encryption</span>
                  </div>
                  <p className="text-sm text-gray-600">{settings.securitySettings.encryptionLevel} encryption active</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Firewall</span>
                  </div>
                  <p className="text-sm text-gray-600">Active and monitoring</p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">SSL Certificate</span>
                  </div>
                  <p className="text-sm text-gray-600">Expires in 45 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Communication Channels</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <div>
                        <label className="font-medium">Email Notifications</label>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.notificationSettings.emailNotifications}
                      onCheckedChange={(value: boolean) => handleSettingChange('notificationSettings', 'emailNotifications', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <div>
                        <label className="font-medium">SMS Notifications</label>
                        <p className="text-sm text-gray-600">Receive alerts via SMS</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.notificationSettings.smsNotifications}
                      onCheckedChange={(value: boolean) => handleSettingChange('notificationSettings', 'smsNotifications', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <div>
                        <label className="font-medium">Push Notifications</label>
                        <p className="text-sm text-gray-600">Browser push notifications</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.notificationSettings.pushNotifications}
                      onCheckedChange={(value: boolean) => handleSettingChange('notificationSettings', 'pushNotifications', value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Alert Types</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">System Alerts</label>
                      <p className="text-sm text-gray-600">Critical system notifications</p>
                    </div>
                    <Switch 
                      checked={settings.notificationSettings.systemAlerts}
                      onCheckedChange={(value: boolean) => handleSettingChange('notificationSettings', 'systemAlerts', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Report Notifications</label>
                      <p className="text-sm text-gray-600">Report generation updates</p>
                    </div>
                    <Switch 
                      checked={settings.notificationSettings.reportNotifications}
                      onCheckedChange={(value: boolean) => handleSettingChange('notificationSettings', 'reportNotifications', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">User Activity Alerts</label>
                      <p className="text-sm text-gray-600">Suspicious user activity</p>
                    </div>
                    <Switch 
                      checked={settings.notificationSettings.userActivityAlerts}
                      onCheckedChange={(value: boolean) => handleSettingChange('notificationSettings', 'userActivityAlerts', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Maintenance Alerts</label>
                      <p className="text-sm text-gray-600">System maintenance updates</p>
                    </div>
                    <Switch 
                      checked={settings.notificationSettings.maintenanceAlerts}
                      onCheckedChange={(value: boolean) => handleSettingChange('notificationSettings', 'maintenanceAlerts', value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-600">Version</label>
                    <p className="font-mono">{settings.systemInfo.version}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Environment</label>
                    <p>{settings.systemInfo.environment}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Database</label>
                    <p>{settings.systemInfo.database}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Last Updated</label>
                    <p>{settings.systemInfo.lastUpdated}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Backup Status</span>
                  </div>
                  <p className="text-sm text-gray-600">{settings.systemInfo.backupStatus}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Time Zone</label>
                  <select className="w-full p-2 border rounded">
                    <option value="IST">India Standard Time (IST)</option>
                    <option value="UTC">Coordinated Universal Time (UTC)</option>
                    <option value="EST">Eastern Standard Time (EST)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2">Date Format</label>
                  <select className="w-full p-2 border rounded">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2">Language</label>
                  <select className="w-full p-2 border rounded">
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2">Maintenance Window</label>
                  <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                    {settings.systemInfo.maintenanceWindow}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">CPU Usage</span>
                </div>
                <div className="space-y-2">
                  <Progress value={settings.systemMetrics.cpu} className="h-2" />
                  <p className="text-sm text-gray-600">{settings.systemMetrics.cpu}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Memory</span>
                </div>
                <div className="space-y-2">
                  <Progress value={settings.systemMetrics.memory} className="h-2" />
                  <p className="text-sm text-gray-600">{settings.systemMetrics.memory}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Storage</span>
                </div>
                <div className="space-y-2">
                  <Progress value={settings.systemMetrics.storage} className="h-2" />
                  <p className="text-sm text-gray-600">{settings.systemMetrics.storage}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Bandwidth</span>
                </div>
                <div className="space-y-2">
                  <Progress value={settings.systemMetrics.bandwidth} className="h-2" />
                  <p className="text-sm text-gray-600">{settings.systemMetrics.bandwidth}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Health Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Connections</span>
                      <span className="font-medium">{settings.systemMetrics.activeConnections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Daily Transactions</span>
                      <span className="font-medium">{settings.systemMetrics.dailyTransactions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Response Time</span>
                      <span className="font-medium text-green-600">185ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className="font-medium text-green-600">0.02%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Alerts & Thresholds</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">CPU Alert Threshold (%)</label>
                      <Input type="number" defaultValue="80" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Memory Alert Threshold (%)</label>
                      <Input type="number" defaultValue="85" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Storage Alert Threshold (%)</label>
                      <Input type="number" defaultValue="90" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  System Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" size="sm">
                      <Database className="w-4 h-4 mr-2" />
                      Optimize DB
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Clear Logs
                    </Button>
                    <Button variant="outline" size="sm">
                      <Cloud className="w-4 h-4 mr-2" />
                      Backup Now
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Scheduled Maintenance</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Next Maintenance</span>
                      </div>
                      <p className="text-sm text-gray-600">Sunday, January 28, 2024 at 2:00 AM IST</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  System Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Log Level</span>
                    <select className="p-1 border rounded text-sm">
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                  
                  <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-auto max-h-32">
                    <div>[2024-01-20 10:30:25] INFO: System started successfully</div>
                    <div>[2024-01-20 10:30:26] INFO: Database connection established</div>
                    <div>[2024-01-20 10:30:27] INFO: Authentication service ready</div>
                    <div>[2024-01-20 10:30:28] WARNING: High memory usage detected</div>
                    <div>[2024-01-20 10:30:29] INFO: Backup completed successfully</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Download Logs
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Clear Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}