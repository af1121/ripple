import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!networkRef.current) return;

    // Create nodes and edges from participants
    const nodes = new DataSet<Node>(
      participants.map(p => ({
        id: p.id,
        label: p.userName,
        title: `${p.userName}<br/>Joined: ${new Date(p.createdAt).toLocaleDateString()}`,
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
        }))
    );

    // Configure the network
    const options: Options = {
      nodes: {
        shape: "dot",
        size: 20,
        font: {
          size: 14,
        },
        borderWidth: 2,
        color: {
          background: "#f97316",
          border: "#ea580c",
          highlight: {
            background: "#fb923c",
            border: "#ea580c",
          },
        },
      },
      edges: {
        width: 2,
        color: {
          color: "#cbd5e1",
          highlight: "#94a3b8",
        },
        smooth: {
          enabled: true,
          type: "continuous",
          roundness: 0.5
        },
      },
      physics: {
        stabilization: true,
        barnesHut: {
          gravitationalConstant: -80000,
          springConstant: 0.001,
          springLength: 200,
        },
      },
      layout: {
        hierarchical: {
          enabled: true,
          direction: "UD",
          sortMethod: "directed",
          nodeSpacing: 150,
          levelSeparation: 150,
        },
      },
    };

    // Create the network
    const network = new Network(
      networkRef.current,
      { nodes, edges },
      options
    );

    // Cleanup
    return () => {
      network.destroy();
    };
  }, [participants]);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <ChallengeMap participants={participants} />
      </Card>
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Nomination Chain</h2>
          <div 
            ref={networkRef} 
            className="w-full" 
            style={{ height: "600px" }}
          />
        </div>
      </Card>
    </div>
  );
} 