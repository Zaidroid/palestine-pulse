/**
 * HelpPanel Component
 * Slide-over panel for contextual documentation and help content
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  HelpCircle,
  BookOpen,
  FileText,
  ExternalLink,
  Search,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { Badge } from "./badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { buttonInteraction, listItemInteraction } from "@/lib/interaction-polish";

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: React.ReactNode;
  tags?: string[];
  relatedArticles?: string[];
}

export interface HelpCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  articles: HelpArticle[];
}

export interface HelpPanelProps {
  categories: HelpCategory[];
  defaultArticleId?: string;
  externalDocsUrl?: string;
  triggerVariant?: 'icon' | 'button' | 'pill';
  triggerLabel?: string;
  className?: string;
}

export const HelpPanel: React.FC<HelpPanelProps> = ({
  categories,
  defaultArticleId,
  externalDocsUrl,
  triggerVariant = 'icon',
  triggerLabel = 'Help',
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState<HelpArticle | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'categories' | 'article'>('categories');

  // Set default article on mount
  React.useEffect(() => {
    if (defaultArticleId && open) {
      const article = categories
        .flatMap(cat => cat.articles)
        .find(art => art.id === defaultArticleId);
      if (article) {
        setSelectedArticle(article);
        setViewMode('article');
      }
    }
  }, [defaultArticleId, open, categories]);

  // Filter articles based on search
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories
      .map(category => ({
        ...category,
        articles: category.articles.filter(
          article =>
            article.title.toLowerCase().includes(query) ||
            article.tags?.some(tag => tag.toLowerCase().includes(query)) ||
            category.name.toLowerCase().includes(query)
        ),
      }))
      .filter(category => category.articles.length > 0);
  }, [categories, searchQuery]);

  const handleArticleClick = (article: HelpArticle) => {
    setSelectedArticle(article);
    setViewMode('article');
  };

  const handleBack = () => {
    setViewMode('categories');
    setSelectedArticle(null);
  };

  const getRelatedArticles = (articleIds: string[] = []) => {
    return articleIds
      .map(id => categories.flatMap(cat => cat.articles).find(art => art.id === id))
      .filter(Boolean) as HelpArticle[];
  };

  const renderTrigger = () => {
    if (triggerVariant === 'button') {
      return (
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          {triggerLabel}
        </Button>
      );
    }

    if (triggerVariant === 'pill') {
      return (
        <div className="group">
          <Button
            variant="outline"
            className="h-11 px-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-border bg-background hover:bg-accent gap-0 group-hover:gap-2 overflow-hidden"
            aria-label="Open help panel"
          >
            <HelpCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 overflow-hidden">
              Need Help?
            </span>
          </Button>
        </div>
      );
    }

    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11 hover:bg-transparent"
        aria-label="Open help panel"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {renderTrigger()}
      </SheetTrigger>
      <SheetContent
        side="right"
        className={cn("w-full sm:max-w-lg", className)}
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Help & Documentation
          </SheetTitle>
          <SheetDescription>
            Find answers and learn more about the dashboard features
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-240px)]">
            <AnimatePresence mode="wait">
              {viewMode === 'categories' ? (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 pr-4"
                >
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="space-y-3">
                      <h3 className="flex items-center gap-2 text-sm font-semibold">
                        {category.icon}
                        {category.name}
                      </h3>
                      <div className="space-y-2">
                        {category.articles.map((article) => (
                          <button
                            key={article.id}
                            onClick={() => handleArticleClick(article)}
                            className={cn(
                              "w-full flex items-center justify-between gap-2",
                              "p-3 rounded-lg border",
                              "text-left text-sm",
                              "hover:bg-accent transition-colors",
                              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            )}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="truncate">{article.title}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {filteredCategories.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No articles found matching your search.</p>
                    </div>
                  )}

                  {externalDocsUrl && (
                    <div className="pt-6 border-t">
                      <a
                        href={externalDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center justify-between gap-2",
                          "p-3 rounded-lg border border-primary/50",
                          "text-sm text-primary",
                          "hover:bg-primary/5 transition-colors"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          <span>View Full Documentation</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="article"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 pr-4"
                >
                  {selectedArticle && (
                    <>
                      {/* Back button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="gap-2 -ml-2"
                      >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                        Back to categories
                      </Button>

                      {/* Article header */}
                      <div className="space-y-2">
                        <Badge variant="secondary">{selectedArticle.category}</Badge>
                        <h2 className="text-xl font-semibold">
                          {selectedArticle.title}
                        </h2>
                        {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {selectedArticle.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Article content */}
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {selectedArticle.content}
                      </div>

                      {/* Related articles */}
                      {selectedArticle.relatedArticles &&
                        selectedArticle.relatedArticles.length > 0 && (
                          <div className="pt-6 border-t space-y-3">
                            <h3 className="text-sm font-semibold">Related Articles</h3>
                            <div className="space-y-2">
                              {getRelatedArticles(selectedArticle.relatedArticles).map(
                                (article) => (
                                  <button
                                    key={article.id}
                                    onClick={() => handleArticleClick(article)}
                                    className={cn(
                                      "w-full flex items-center justify-between gap-2",
                                      "p-2 rounded-lg",
                                      "text-left text-sm",
                                      "hover:bg-accent transition-colors"
                                    )}
                                  >
                                    <span className="truncate">{article.title}</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

HelpPanel.displayName = "HelpPanel";
