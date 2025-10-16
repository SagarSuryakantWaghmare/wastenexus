"use client";

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit, Trash2, Calendar, MapPin, Users, Target } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Event {
  id: string;
  championId: string;
  title: string;
  description: string;
  wasteFocus: string;
  locationName: string;
  locationAddress: string;
  eventDate: string;
  imageUrl: string;
  participantCount: number;
  status: string;
  createdAt: string;
}

interface ChampionEventListProps {
  events: Event[];
  loading: boolean;
  onRefresh: () => void;
}

export function ChampionEventList({ events, loading, onRefresh }: ChampionEventListProps) {
  const { apiCall } = useApi();

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    wasteFocus: '',
    locationName: '',
    locationAddress: '',
    eventDate: '',
    imageUrl: '',
  });

  const wasteFocusOptions = [
    { value: 'Waste Collection', label: 'Waste Collection' },
    { value: 'Tree Plantation', label: 'Tree Plantation' },
    { value: 'E-Waste Drive', label: 'E-Waste Drive' },
    { value: 'Beach Cleanup', label: 'Beach Cleanup' },
    { value: 'Recycling Workshop', label: 'Recycling Workshop' },
    { value: 'Awareness Campaign', label: 'Awareness Campaign' },
  ];

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title,
      description: event.description,
      wasteFocus: event.wasteFocus,
      locationName: event.locationName,
      locationAddress: event.locationAddress,
      eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
      imageUrl: event.imageUrl || '',
    });
  };

  const handleEditSubmit = async () => {
    if (!editingEvent) return;

    if (editFormData.description.length < 50) {
      toast.error('Description must be at least 50 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiCall(`/api/events/${editingEvent.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editFormData.title,
          description: editFormData.description,
          wasteFocus: editFormData.wasteFocus,
          locationName: editFormData.locationName,
          locationAddress: editFormData.locationAddress,
          eventDate: editFormData.eventDate,
          imageUrl: editFormData.imageUrl,
        }),
      });

      toast.success('Event updated successfully!');
      setEditingEvent(null);
      onRefresh();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    setIsSubmitting(true);

    try {
      await apiCall(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      toast.success('Event deleted successfully!');
      setDeletingEventId(null);
      onRefresh();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Events Yet</h3>
          <p className="text-gray-500">Create your first event to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="border-green-100 hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              {event.imageUrl && (
                <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg text-green-800 line-clamp-2">{event.title}</CardTitle>
                <Badge
                  variant={event.status === 'upcoming' ? 'default' : 'secondary'}
                  className={
                    event.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-gray-100 text-gray-700'
                  }
                >
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="line-clamp-3">{event.description}</CardDescription>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-gray-600">
                  <Target className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                  <span className="font-medium">{event.wasteFocus}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="font-medium">{event.locationName}</p>
                    <p className="text-xs text-gray-500">{event.locationAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4 text-green-600" />
                  <span>{event.participantCount} participant{event.participantCount !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(event)}
                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeletingEventId(event.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingEvent !== null} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update the event details</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Title *</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="border-green-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-wasteFocus">Waste Focus *</Label>
                <Select
                  value={editFormData.wasteFocus}
                  onValueChange={(value) => setEditFormData({ ...editFormData, wasteFocus: value })}
                >
                  <SelectTrigger className="border-green-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteFocusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description * (Min. 50 characters)</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={4}
                className="border-green-200"
              />
              <p className="text-xs text-gray-500">{editFormData.description.length} / 50</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-locationName">Location Name *</Label>
                <Input
                  id="edit-locationName"
                  value={editFormData.locationName}
                  onChange={(e) => setEditFormData({ ...editFormData, locationName: e.target.value })}
                  className="border-green-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-eventDate">Date & Time *</Label>
                <Input
                  id="edit-eventDate"
                  type="datetime-local"
                  value={editFormData.eventDate}
                  onChange={(e) => setEditFormData({ ...editFormData, eventDate: e.target.value })}
                  className="border-green-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-locationAddress">Full Address *</Label>
              <Input
                id="edit-locationAddress"
                value={editFormData.locationAddress}
                onChange={(e) => setEditFormData({ ...editFormData, locationAddress: e.target.value })}
                className="border-green-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-imageUrl">Image URL (Optional)</Label>
              <Input
                id="edit-imageUrl"
                type="url"
                value={editFormData.imageUrl}
                onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                className="border-green-200"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingEvent(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleEditSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deletingEventId !== null} onOpenChange={(open) => !open && setDeletingEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEventId && handleDelete(deletingEventId)}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting...</> : 'Delete Event'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
