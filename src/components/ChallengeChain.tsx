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
        shape: "circularImage",
        image: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        size: 25,
        font: {
          size: 14,
          color: "#64748b",
          face: "Inter, system-ui, sans-serif",
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
          forceDirection: "vertical"
        },
      },
      physics: {
        enabled: false,
      },
      layout: {
        hierarchical: {
          enabled: true,
          direction: "UD",
          sortMethod: "directed",
          nodeSpacing: 100,
          levelSeparation: 100,
          treeSpacing: 100,
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
      configure: false,
      height: '400px',
      autoResize: true,
      scale: 1.2,
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
            className="w-full overflow-hidden" 
            style={{ height: "400px" }}
          />
        </div>
      </Card>
    </div>
  );
} 