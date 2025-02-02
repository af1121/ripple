import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChallengeMap } from "@/components/ChallengeMap";
import { Network, Edge, Node, Options } from "vis-network";
import { DataSet } from "vis-data";
import { Button } from "@/components/ui/button";

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

interface CustomNode extends Node {
  label: string;
  hiddenLabel?: string;
}

export function ChallengeChain({ participants }: { participants: ChainNode[] }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const networkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    // Create nodes and edges from participants
    const nodes = new DataSet<CustomNode>(
      participants.map(p => ({
        id: p.id,
        label: '',
        title: `
          <div class="p-2">
            <div class="text-lg font-bold mb-1">${p.userName}</div>
            Joined: ${new Date(p.createdAt).toLocaleDateString()}<br/>
            ${p.location ? `Location: ${p.location.lat.toFixed(2)}, ${p.location.lng.toFixed(2)}` : 'No location'}<br/>
            ${p.nominatedBy ? `Nominated by: Participant ${p.nominatedBy}` : 'Challenge Creator'}
          </div>
        `,
        hiddenLabel: p.userName,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
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

    const options: Options = {
      nodes: {
        shape: "circularImage",
        size: window.innerWidth < 768 ? 40 : 50,
        font: {
          size: window.innerWidth < 768 ? 14 : 24,
          color: "#64748b",
          face: "Inter, system-ui, sans-serif",
          align: "left",
          vadjust: -8
        },
        borderWidth: 3,
        borderWidthSelected: 4,
        color: {
          background: "#fff",
          border: "#0d9488",
          highlight: {
            background: "#fff",
            border: "#0d9488",
          },
          hover: {
            background: "#fff",
            border: "#0d9488",
          }
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.2)',
          size: 10,
          x: 0,
          y: 4
        }
      },
      edges: {
        width: 2,
        selectionWidth: 2.5,
        color: {
          color: "#e2e8f0",
          highlight: "#0d9488",
          hover: "#0d9488",
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
          nodeSpacing: window.innerWidth < 768 ? 100 : 100,
          levelSeparation: window.innerWidth < 768 ? 180 : 200,
          treeSpacing: window.innerWidth < 768 ? 100 : 100,
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

    // Add click event handler
    network.on('click', function(params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = nodes.get(nodeId);
        if (node) {
          // Toggle label
          nodes.update({
            id: nodeId,
            label: node.label ? '' : node.hiddenLabel
          });
        }
      }
    });

    return () => {
      network.destroy();
    };
  }, [participants]);

  return (
    <div className="space-y-8">
      <Card className={`overflow-hidden bg-muted ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Nomination Chain</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullScreen(!isFullScreen)}
            >
              {isFullScreen ? 'Close' : 'View Full Screen'}
            </Button>
          </div>
          <div 
            ref={networkRef} 
            className="w-full overflow-hidden" 
            style={{ 
              height: isFullScreen 
                ? 'calc(100vh - 100px)' 
                : window.innerWidth < 768 ? "100px" : "200px"
            }}
          />
        </div>
      </Card>
      {!isFullScreen && (
        <Card className="overflow-hidden">
          <ChallengeMap participants={participants} />
        </Card>
      )}
    </div>
  );
} 