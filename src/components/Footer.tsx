import { Facebook, Linkedin } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <footer className="border-t bg-background mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Phát triển bởi:{' '}
            <span className="font-semibold text-foreground">Quang Đạt MMO</span>
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
            >
              <a
                href="https://facebook.com/quangdatcse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Facebook className="w-4 h-4" />
                <span className="hidden sm:inline">Facebook</span>
              </a>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
            >
              <a
                href="https://www.linkedin.com/in/quangdatcse/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            © 2024 Tạo ảnh nhanh kết hợp tool nén ảnh online miễn phí và bảo mật.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
