import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Newspaper, Search, Calendar, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

interface PressKilledListProps {
  data: any[];
  loading: boolean;
}

export const PressKilledList = ({ data, loading }: PressKilledListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");

  // Get unique organizations
  const organizations = useMemo(() => {
    if (!data) return [];
    const orgs = new Set(data.map(item => item.org).filter(Boolean));
    return Array.from(orgs).sort();
  }, [data]);

  // Filter data
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.org?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nationality?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesOrg = selectedOrg === "all" || item.org === selectedOrg;
      
      return matchesSearch && matchesOrg;
    });
  }, [data, searchTerm, selectedOrg]);

  // Group by organization
  const groupedByOrg = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    filteredData.forEach(item => {
      const org = item.org || "Independent";
      if (!grouped[org]) grouped[org] = [];
      grouped[org].push(item);
    });
    return grouped;
  }, [filteredData]);

  if (loading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary" />
          Press & Journalists Killed in Gaza
        </CardTitle>
        <CardDescription>
          Remembering the {data?.length || 0} journalists and media workers who lost their lives
        </CardDescription>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, organization, or nationality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedOrg} onValueChange={setSelectedOrg} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
            <TabsTrigger value="all">All ({data?.length || 0})</TabsTrigger>
            {organizations.slice(0, 10).map(org => (
              <TabsTrigger key={org} value={org}>
                {org} ({data?.filter(item => item.org === org).length || 0})
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
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="secondary" className="text-sm">
                        {members.length}
                      </Badge>
                      {org}
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {members.map((person, idx) => (
                        <Card 
                          key={idx} 
                          className="border-border hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-[1.02] group"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1 truncate">
                                  {person.name}
                                </h4>
                                {person.nationality && (
                                  <p className="text-xs text-muted-foreground mb-1">
                                    {person.nationality}
                                  </p>
                                )}
                                {person.date && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(person.date).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric"
                                    })}
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
      </CardContent>
    </Card>
  );
};
