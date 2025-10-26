/**
 * Share Button Component
 * 
 * Provides sharing functionality with:
 * - Shareable URLs with current state
 * - Copy to clipboard with success toast
 * - Native share API support on mobile
 * - Social media sharing options
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Share2, 
  Link2, 
  Check, 
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { showShareSuccessNotification } from '@/lib/export-notifications';

interface ShareButtonProps {
  title?: string;
  description?: string;
  url?: string;
  state?: Record<string, any>;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export const ShareButton = ({
  title = 'Palestine Humanitarian Dashboard',
  description = 'View humanitarian data and statistics',
  url,
  state,
  className,
  variant = 'outline',
  size = 'sm',
  showLabel = true,
}: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  // Generate shareable URL with state
  const generateShareableUrl = (): string => {
    const baseUrl = url || window.location.href.split('?')[0];
    
    if (state && Object.keys(state).length > 0) {
      const params = new URLSearchParams();
      
      // Encode state as URL parameters
      Object.entries(state).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
      
      return `${baseUrl}?${params.toString()}`;
    }
    
    return baseUrl;
  };

  const shareUrl = generateShareableUrl();

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      showShareSuccessNotification(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy link to clipboard',
        variant: 'destructive',
      });
    }
  };

  // Native share API (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        
        showShareSuccessNotification(false);
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  // Social media share URLs
  const getSocialShareUrl = (platform: 'twitter' | 'facebook' | 'linkedin' | 'email'): string => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      case 'email':
        return `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
      default:
        return shareUrl;
    }
  };

  const openSocialShare = (platform: 'twitter' | 'facebook' | 'linkedin' | 'email') => {
    const url = getSocialShareUrl(platform);
    
    if (platform === 'email') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  // Check if native share is supported
  const supportsNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn('gap-2', className)}
          >
            <Share2 className="h-4 w-4" />
            {showLabel && size !== 'icon' && <span>Share</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Share Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {supportsNativeShare && (
            <>
              <DropdownMenuItem onClick={handleNativeShare}>
                <Smartphone className="h-4 w-4 mr-2" />
                Share via...
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem onClick={copyToClipboard}>
            {copied ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setShowDialog(true)}>
            <Link2 className="h-4 w-4 mr-2" />
            View Link
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Share on Social Media
          </DropdownMenuLabel>
          
          <DropdownMenuItem onClick={() => openSocialShare('twitter')}>
            <Twitter className="h-4 w-4 mr-2 text-blue-400" />
            Twitter
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => openSocialShare('facebook')}>
            <Facebook className="h-4 w-4 mr-2 text-blue-600" />
            Facebook
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => openSocialShare('linkedin')}>
            <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
            LinkedIn
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => openSocialShare('email')}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Link Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Link</DialogTitle>
            <DialogDescription>
              Anyone with this link can view the current dashboard state
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="font-mono text-sm"
              />
            </div>
            <Button
              size="sm"
              onClick={copyToClipboard}
              className="px-3"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {state && Object.keys(state).length > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs font-medium mb-2">Shared State:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                {Object.entries(state).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-mono">{key}:</span>
                    <span className="font-mono truncate ml-2">
                      {typeof value === 'object' ? JSON.stringify(value).substring(0, 30) + '...' : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
