import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChallengeMap } from "@/components/ChallengeMap";
import { Network, Edge, Node, Options } from "vis-network";
import { DataSet } from "vis-data";

export interface ChainNode {
  id: string;
  userName: string;
  nominatedBy?: string;
  createdAt: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export function ChallengeChain({ participants }: { participants: ChainNode[] }) {
  const networkRef = useRef<HTMLDivElement>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!networkRef.current) return;

    // Helper function to get all child nodes
    const getChildNodes = (nodeId: string): string[] => {
      const children: string[] = [];
      participants
        .filter(p => p.nominatedBy === nodeId)
        .forEach(child => {
          children.push(child.id);
          if (!collapsedNodes.has(child.id)) {
            children.push(...getChildNodes(child.id));
          }
        });
      return children;
    };

    // Create nodes and edges from participants
    const nodes = new DataSet<Node>(
      participants.map(p => ({
        id: p.id,
        label: p.userName,
        title: `
          <div class="p-2">
            <strong>${p.userName}</strong><br/>
            Joined: ${new Date(p.createdAt).toLocaleDateString()}<br/>
            ${p.location ? `Location: ${p.location.lat.toFixed(2)}, ${p.location.lng.toFixed(2)}` : 'No location'}<br/>
            ${p.nominatedBy ? `Nominated by: Participant ${p.nominatedBy}` : 'Challenge Creator'}
          </div>
        `,
        hidden: false,
        group: collapsedNodes.has(p.nominatedBy || '') ? 'hidden' : 'visible',
      }))
    );

    const edges = new DataSet<Edge>(
      participants
        .filter(p => p.nominatedBy)
        .map(p => ({
          id: `${p.nominatedBy}-${p.id}`,
          from: p.nominatedBy,
          to: p.id,
          arrows: "to",
          hidden: collapsedNodes.has(p.nominatedBy),
        }))
    );

    // Configure the network
    const options: Options = {
      nodes: {
        shape: "circularImage",
        image: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        size: 25,
        font: {
          size: 14,
          color: "#64748b",
          face: "Inter, system-ui, sans-serif",
          align: "left",
        },
        borderWidth: 2,
        borderWidthSelected: 3,
        color: {
          background: "#fff",
          border: "#f97316",
          highlight: {
            background: "#fff",
            border: "#ea580c",
          },
          hover: {
            background: "#fff",
            border: "#ea580c",
          }
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.2)',
          size: 8,
          x: 0,
          y: 4
        }
      },
      edges: {
        width: 1.5,
        selectionWidth: 2,
        color: {
          color: "#e2e8f0",
          highlight: "#f97316",
          hover: "#f97316",
        },
        smooth: {
          enabled: true,
          type: "cubicBezier",
          roundness: 0.5,
          forceDirection: "horizontal"
        },
      },
      physics: {
        enabled: false,
      },
      layout: {
        hierarchical: {
          enabled: true,
          direction: "LR",
          sortMethod: "directed",
          nodeSpacing: 120,
          levelSeparation: 150,
          treeSpacing: 120,
          parentCentralization: true,
          blockShifting: true,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
        hideEdgesOnDrag: true,
        keyboard: false,
        multiselect: false,
      },
    };

    // Create the network
    const network = new Network(
      networkRef.current,
      { nodes, edges },
      options
    );

    // Add double-click event handler for collapsing/expanding nodes
    network.on("doubleClick", (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const childNodes = getChildNodes(nodeId);
        
        setCollapsedNodes(prev => {
          const newCollapsed = new Set(prev);
          if (newCollapsed.has(nodeId)) {
            newCollapsed.delete(nodeId);
          } else {
            newCollapsed.add(nodeId);
          }
          return newCollapsed;
        });

        // Toggle visibility of child nodes and their edges
        childNodes.forEach(childId => {
          nodes.update({ id: childId, hidden: !collapsedNodes.has(nodeId) });
          edges.get().forEach(edge => {
            if (edge.from === nodeId || childNodes.includes(edge.from as string)) {
              edges.update({ id: edge.id, hidden: !collapsedNodes.has(nodeId) });
            }
          });
        });
      }
    });

    // Cleanup
    return () => {
      network.destroy();
    };
  }, [participants, collapsedNodes]);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <ChallengeMap participants={participants} />
      </Card>
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Nomination Chain</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Double-click on a node to collapse/expand its children
          </p>
          <div 
            ref={networkRef} 
            className="w-full overflow-hidden" 
            style={{ height: "400px" }}
          />
        </div>
      </Card>
    </div>
  );
} 