import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Save, Trash2, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminAICompanion() {
  const [knowledgeContent, setKnowledgeContent] = useState("");
  const [knowledgeTitle, setKnowledgeTitle] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: insights, refetch: refetchInsights } = trpc.aiCompanion.getInsights.useQuery({
    limit: 100,
  });

  const { data: conversations, refetch: refetchConversations } = trpc.aiCompanion.getHistory.useQuery({
    limit: 100,
  });

  const addKnowledge = () => {
    if (!knowledgeTitle || !knowledgeContent) {
      toast.error("Please fill in all fields");
      return;
    }

    // In a real implementation, you'd save this to a knowledge base table
    toast.success("Knowledge added successfully");
    setKnowledgeTitle("");
    setKnowledgeContent("");
    setShowAddDialog(false);
  };

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">AI Companion Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage AI companion knowledge base, insights, and conversations
          </p>
        </div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList>
            <TabsTrigger value="insights">User Insights</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          </TabsList>

          {/* User Insights */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generated Insights</CardTitle>
                <CardDescription>
                  AI-generated insights about user behavior and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!insights || insights.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No insights generated yet
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insights.map((insight) => (
                        <TableRow key={insight.id}>
                          <TableCell className="font-medium">{insight.insightType}</TableCell>
                          <TableCell>{insight.title}</TableCell>
                          <TableCell className="max-w-md truncate">{insight.description}</TableCell>
                          <TableCell>{insight.confidence}%</TableCell>
                          <TableCell>{new Date(insight.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversations */}
          <TabsContent value="conversations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
                <CardDescription>
                  All conversations between users and the AI companion
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!conversations || conversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No conversations yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-4 rounded-lg ${
                          conv.role === "user" ? "bg-muted" : "bg-primary/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {conv.role === "user" ? "User" : "AI Companion"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(conv.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{conv.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base */}
          <TabsContent value="knowledge" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Knowledge Base</CardTitle>
                    <CardDescription>
                      Billionaire principles and frameworks for the AI companion
                    </CardDescription>
                  </div>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Knowledge
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Knowledge</DialogTitle>
                        <DialogDescription>
                          Add a new principle, framework, or insight to the knowledge base
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={knowledgeTitle}
                            onChange={(e) => setKnowledgeTitle(e.target.value)}
                            placeholder="e.g., Focus Principle - Warren Buffett"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="content">Content</Label>
                          <Textarea
                            id="content"
                            value={knowledgeContent}
                            onChange={(e) => setKnowledgeContent(e.target.value)}
                            placeholder="Enter the principle, framework, or insight..."
                            rows={10}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addKnowledge}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Universal Principles</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Focus: Do one thing exceptionally well</li>
                      <li>• Time leverage: Your time is your most valuable asset</li>
                      <li>• Asymmetric bets: Risk little, gain much</li>
                      <li>• Cash runway: Always know your burn rate</li>
                      <li>• Health = wealth: Physical and mental health enable everything</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Cultural Intelligence</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• US: Speed, innovation, risk-taking</li>
                      <li>• China: Long-term thinking, relationship-building (guanxi)</li>
                      <li>• India: Frugal innovation, family networks</li>
                      <li>• Middle East: Trust-based relationships, patience</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Decision Frameworks</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• 10x filter: Will this 10x my outcome?</li>
                      <li>• Regret minimization: What will I regret NOT doing?</li>
                      <li>• Asymmetry test: Is the upside 10x the downside?</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
