import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { EnhancedMetricCard } from "@/components/ui/enhanced-metric-card";
import { Newspaper, Search, Calendar, User, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PressCasualtiesWidgetProps {
  pressData: any[];
  loading: boolean;
}

export const PressCasualtiesWidget = ({ pressData, loading }: PressCasualtiesWidgetProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");

  const pressKilled = pressData?.length || 0;

  const organizations = useMemo(() => {
    if (!pressData) return [];
    const orgs = new Set(pressData.map(item => item.org).filter(Boolean));
    return Array.from(orgs).sort();
  }, [pressData]);

  const filteredData = useMemo(() => {
    if (!pressData) return [];
    return pressData.filter(item => {
      const matchesSearch = searchTerm === "" ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.org?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nationality?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOrg = selectedOrg === "all" || item.org === selectedOrg;
      return matchesSearch && matchesOrg;
    });
  }, [pressData, searchTerm, selectedOrg]);

  const groupedByOrg = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    filteredData.forEach(item => {
      const org = item.org || "Independent";
      if (!grouped[org]) grouped[org] = [];
      grouped[org].push(item);
    });
    return grouped;
  }, [filteredData]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <EnhancedMetricCard
            title="Press/Journalists Killed"
            value={pressKilled}
            icon={Newspaper}
            gradient={{ from: "secondary/20", to: "secondary/5", direction: "br" }}
            change={{ value: 3.2, trend: "up", period: "vs last month" }}
            dataSources={["tech4palestine"]}
            quality="high"
            loading={loading}
            className="text-secondary cursor-pointer"
            description="Journalists and media workers killed"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Newspaper className="h-8 w-8 text-primary" />
            In Memoriam: Press Casualties
          </DialogTitle>
          <DialogDescription>
            Honoring the {pressKilled} journalists and media workers who have lost their lives.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, organization..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <ScrollArea className="h-full">
          <Tabs value={selectedOrg} onValueChange={setSelectedOrg} className="w-full mt-4">
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
              <TabsTrigger value="all">All ({pressData?.length || 0})</TabsTrigger>
              {organizations.slice(0, 10).map(org => (
                <TabsTrigger key={org} value={org}>
                  {org} ({pressData?.filter(item => item.org === org).length || 0})
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={selectedOrg} className="mt-6">
              {Object.keys(groupedByOrg).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No results found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedByOrg).map(([org, members]) => (
                    <div key={org}>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                        <Badge variant="secondary" className="text-base px-3 py-1">{members.length}</Badge>
                        {org}
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {members.map((person, idx) => (
                          <Card key={idx} className="border-border hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-[1.02] group bg-background/70">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                  <User className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-md mb-1 truncate group-hover:text-primary transition-colors">{person.name}</h4>
                                  {person.nationality && <p className="text-sm text-muted-foreground mb-1.5">{person.nationality}</p>}
                                  {person.date && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Calendar className="h-4 w-4" />
                                      {new Date(person.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};