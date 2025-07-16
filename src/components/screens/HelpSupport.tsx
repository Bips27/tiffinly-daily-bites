import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageCircle, Phone, Mail, Search, ChevronRight, Send, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'orders' | 'payments' | 'subscription' | 'delivery' | 'account';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'support';
  message: string;
  timestamp: Date;
}

export const HelpSupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
    {
      id: '1',
      type: 'support',
      message: 'Hello! I\'m here to help you with any questions about Tiffinly. What can I assist you with today?',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = React.useState('');
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I customize my meals?',
      answer: 'You can customize your meals up to 2 hours before the scheduled delivery time. Go to the Menu tab, select a meal, and tap "Customize" to add extra items or make changes.',
      category: 'orders'
    },
    {
      id: '2',
      question: 'What if I miss the customization deadline?',
      answer: 'If you miss the 2-hour customization deadline, you\'ll receive the default meal for that time slot. However, you can still customize other meals for the day if their deadlines haven\'t passed.',
      category: 'orders'
    },
    {
      id: '3',
      question: 'How do I add money to my wallet?',
      answer: 'Go to the Wallet section in your profile, tap "Add Money" and choose your preferred payment method. You can add money via UPI, credit/debit card, or net banking.',
      category: 'payments'
    },
    {
      id: '4',
      question: 'Can I pause my subscription?',
      answer: 'Yes! You can pause your subscription anytime from the Subscription section. You can pause for specific days or weeks, and resume whenever you want.',
      category: 'subscription'
    },
    {
      id: '5',
      question: 'What are the delivery timings?',
      answer: 'Our standard delivery timings are: Breakfast (8:00-9:00 AM), Lunch (12:30-1:30 PM), and Dinner (7:30-8:30 PM). You\'ll receive real-time updates about your delivery.',
      category: 'delivery'
    },
    {
      id: '6',
      question: 'How do I change my delivery address?',
      answer: 'Go to Profile > Saved Addresses, where you can add, edit, or delete addresses. You can also set a default address for all deliveries.',
      category: 'account'
    }
  ];

  const topics = [
    { id: 'orders', name: 'Orders & Meals', icon: '🍽️' },
    { id: 'payments', name: 'Payments & Wallet', icon: '💳' },
    { id: 'subscription', name: 'Subscription Plans', icon: '📅' },
    { id: 'delivery', name: 'Delivery Issues', icon: '🚚' },
    { id: 'account', name: 'Account Settings', icon: '👤' },
    { id: 'other', name: 'Other Issues', icon: '❓' }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = !selectedTopic || faq.category === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate support response
    setTimeout(() => {
      const supportMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'support',
        message: 'Thank you for your message! Our support team will get back to you shortly. In the meantime, you can check our FAQ section for quick answers.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, supportMessage]);
    }, 1000);

    toast({
      title: "Message sent",
      description: "We'll get back to you soon!"
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
          <h1 className="text-lg font-semibold">Help & Support</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 gap-3">
          <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
            <SheetTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Live Chat</h3>
                      <p className="text-sm text-muted-foreground">Chat with our support team</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Live Chat Support</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full mt-4">
                <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`p-2 rounded-full ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="h-3 w-3" />
                          ) : (
                            <Bot className="h-3 w-3" />
                          )}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Call Us</h3>
                  <p className="text-sm text-muted-foreground">+91 9876543210</p>
                </div>
                <Badge variant="secondary">24/7</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-sm text-muted-foreground">support@tiffinly.com</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Topic Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTopic === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTopic(null)}
              >
                All
              </Button>
              {topics.map((topic) => (
                <Button
                  key={topic.id}
                  variant={selectedTopic === topic.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTopic(topic.id)}
                  className="text-xs"
                >
                  {topic.icon} {topic.name}
                </Button>
              ))}
            </div>

            <Separator />

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No FAQs found matching your search.</p>
                </div>
              ) : (
                filteredFAQs.map((faq) => (
                  <Card key={faq.id} className="border-l-4 border-l-primary/20">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="Brief description of your issue" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea 
                placeholder="Describe your issue in detail..."
                rows={4}
              />
            </div>
            <Button className="w-full">
              Submit Request
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};