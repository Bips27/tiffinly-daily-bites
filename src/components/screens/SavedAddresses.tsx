import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, Home, Briefcase, Users, MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  label: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export const SavedAddresses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [addresses, setAddresses] = React.useState<Address[]>([
    {
      id: '1',
      type: 'home',
      label: 'Home',
      line1: '123 Green Valley Apartments',
      line2: 'Block A, Flat 405',
      city: 'Mumbai',
      pincode: '400001',
      landmark: 'Near City Mall',
      isDefault: true
    },
    {
      id: '2',
      type: 'office',
      label: 'Office',
      line1: 'Tech Park Building',
      line2: 'Floor 8, Wing B',
      city: 'Mumbai',
      pincode: '400070',
      landmark: 'Opposite Metro Station',
      isDefault: false
    }
  ]);

  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);
  const [newAddress, setNewAddress] = React.useState<Partial<Address>>({
    type: 'home',
    label: '',
    line1: '',
    line2: '',
    city: '',
    pincode: '',
    landmark: '',
    isDefault: false
  });

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'office': return <Briefcase className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const handleSaveAddress = () => {
    if (!newAddress.label || !newAddress.line1 || !newAddress.city || !newAddress.pincode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const addressToSave = {
      ...newAddress,
      id: editingAddress?.id || Date.now().toString(),
      isDefault: addresses.length === 0 || newAddress.isDefault || false
    } as Address;

    if (editingAddress) {
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id ? addressToSave : addr
      ));
      toast({
        title: "Address updated",
        description: "Your address has been updated successfully."
      });
    } else {
      if (addressToSave.isDefault) {
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
      }
      setAddresses(prev => [...prev, addressToSave]);
      toast({
        title: "Address added",
        description: "New address has been saved successfully."
      });
    }

    setIsAddingNew(false);
    setEditingAddress(null);
    setNewAddress({
      type: 'home',
      label: '',
      line1: '',
      line2: '',
      city: '',
      pincode: '',
      landmark: '',
      isDefault: false
    });
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setIsAddingNew(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast({
      title: "Address deleted",
      description: "Address has been removed from your saved addresses."
    });
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast({
      title: "Default address updated",
      description: "This address has been set as your default delivery location."
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Saved Addresses</h1>
          <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-10 w-10 rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Address Type</Label>
                  <Select
                    value={newAddress.type}
                    onValueChange={(value: 'home' | 'office' | 'other') => 
                      setNewAddress(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="label">Address Label</Label>
                  <Input
                    id="label"
                    placeholder="e.g., Home, Office, etc."
                    value={newAddress.label}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1 *</Label>
                  <Input
                    id="line1"
                    placeholder="Building, Street"
                    value={newAddress.line1}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, line1: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line2">Address Line 2</Label>
                  <Input
                    id="line2"
                    placeholder="Apartment, Floor (Optional)"
                    value={newAddress.line2}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, line2: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      placeholder="000000"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    placeholder="Nearby landmark (Optional)"
                    value={newAddress.landmark}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isDefault" className="text-sm">Set as default address</Label>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingAddress(null);
                      setNewAddress({
                        type: 'home',
                        label: '',
                        line1: '',
                        line2: '',
                        city: '',
                        pincode: '',
                        landmark: '',
                        isDefault: false
                      });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveAddress} className="flex-1">
                    {editingAddress ? 'Update' : 'Save'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-xl font-semibold mb-2">No addresses saved</h2>
            <p className="text-muted-foreground mb-6">
              Add your first delivery address to get started
            </p>
            <Button onClick={() => setIsAddingNew(true)}>
              Add Address
            </Button>
          </div>
        ) : (
          addresses.map((address) => (
            <Card key={address.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getAddressIcon(address.type)}
                    <h3 className="font-semibold">{address.label}</h3>
                    {address.isDefault && (
                      <Badge variant="default" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                      className="h-8 w-8 rounded-full"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground mb-3">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>{address.city}, {address.pincode}</p>
                  {address.landmark && <p>Near {address.landmark}</p>}
                </div>

                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="w-full"
                  >
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};