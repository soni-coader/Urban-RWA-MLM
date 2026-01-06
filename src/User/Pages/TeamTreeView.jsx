import React, { useRef, useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Tree from "react-d3-tree";
import axios from "axios";
import { appConfig } from "../../config/appConfig";
import { useDemoMode } from "../Contexts/DemoModeContext";
import { getDemoData } from "../Data/demoData";

const TeamTreeView = () => {
  const { isDemoMode } = useDemoMode();
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const treeContainer = useRef(null);

  // Transform API data to match react-d3-tree format
  const transformTreeData = useCallback((apiData) => {
    if (!apiData?.data?.data || !Array.isArray(apiData.data.data)) {
      return [];
    }
    const transformNode = (node) => ({
      name: node.name || "Unknown",
      attributes: {
        Username: node.username || "Unknown",
        Self: `$${node.selfInvestment || 0}`,
        Team: `$${node.teamInvestment || 0}`,
      },
      children: node.children ? node.children.map(transformNode) : [],
    });
    return apiData.data.data.map(transformNode);
  }, []);

  // Fetch team tree data using useQuery
  const { data: teamTreeData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["teamTree"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found. Please log in.");
      const response = await axios.get(`${appConfig.baseURL}/user/team-tree-view`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return transformTreeData(response.data);
    },
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    retry: 2, // Retry failed requests twice
    enabled: !isDemoMode && (!!localStorage.getItem("authToken") || !!sessionStorage.getItem("authToken")), // Only fetch if token exists and not in demo mode
  });

  // Use demo data if demo mode is active
  const displayTreeData = isDemoMode
    ? transformTreeData({ data: { data: getDemoData("teamTree") } })
    : teamTreeData;

  // Update translate on resize
  useEffect(() => {
    const updateTranslate = () => {
      if (treeContainer.current) {
        const dimensions = treeContainer.current.getBoundingClientRect();
        if (dimensions.width && dimensions.height) {
          setTranslate({
            x: dimensions.width / 2,
            y: dimensions.height / 4,
          });
        }
      }
    };

    updateTranslate();
    window.addEventListener("resize", updateTranslate);
    return () => window.removeEventListener("resize", updateTranslate);
  }, []);

  // Custom styled node
  const renderNodeWithCustomStyles = useCallback(
    ({ nodeDatum, toggleNode }) => (
      <g
        onClick={toggleNode}
        role="button"
        aria-label={`Toggle node for ${nodeDatum.name || "Unknown"}`}
        tabIndex={0}
        onKeyPress={(e) => e.key === "Enter" && toggleNode()}
      >
        <circle r={20} fill="#2298D3" stroke="#1e40af" strokeWidth={2} />
        {/* <path
          d="M 0 0 a 15.5 15 0 1 1 30 0 z"
          fill="#10B981"
          transform="translate(-7, -28) rotate(15)"
          stroke="#059669"
          strokeWidth={1}
        /> */}
        {/* <circle cx={5} cy={-33} r={2} fill="#ffffff" stroke="none" /> */}
        {/* <circle cx={15} cy={-30} r={2} fill="#ffffff" stroke="none" /> */}
        <text
          x={30}
          dy="-10"
          fontSize={14}
          fontWeight="bold"
          textAnchor="start"
          fill="#059669"
          stroke="#ffffff"
          strokeWidth={1}
          paintOrder="stroke"
        >
          {/* {nodeDatum.name || "Unknown"} */}
        </text>
        {nodeDatum.attributes && (
          <>
            <text
              x={30}
              dy="5"
              fontSize={12}
              fill="#1f1f37"
              stroke="#ffffff"
              strokeWidth={1}
              paintOrder="stroke"
            >
              Username: {nodeDatum.attributes.Username || "Unknown"}
            </text>
            <text
              x={30}
              dy="20"
              fontSize={12}
              fill="#1f2937"
              stroke="#ffffff"
              strokeWidth={1}
              paintOrder="stroke"
            >
              Self: {nodeDatum.attributes.Self || "$0"}
            </text>
            <text
              x={30}
              dy="35"
              fontSize={12}
              fill="#1f2937"
              stroke="#ffffff"
              strokeWidth={1}
              paintOrder="stroke"
            >
              Team: {nodeDatum.attributes.Team || "$0"}
            </text>
          </>
        )}
      </g>
    ),
    []
  );

  return (
    <div
      ref={treeContainer}
      className="theme-card-style border-gradient"
      style={{ width: "100%", height: "90vh", position: "relative", overflow: "auto" }}
    >
      <style>{`
        .custom-link-path {
          stroke: #000000 !important;
          stroke-width: 2px !important;
          fill: none !important;
        }
      `}</style>
      {isDemoMode && (
        <div className="absolute right-4 top-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-20">
          Demo Mode
        </div>
      )}
      <div className="text-xs absolute left-4 top-4 rounded-xl bg-white border-2 border-gray-300 p-4 text-gray-800 shadow-lg w-fit space-y-1 z-10">
        <p className="font-bold text-sm text-blue-600 mb-1">Manual</p>
        <p>
          <span className="text-green-600 font-semibold">Click node</span> → Expand / Collapse team
        </p>
        <p>
          <span className="text-blue-600 font-semibold">Scroll</span> → Zoom in / out
        </p>
        <p>
          <span className="text-pink-600 font-semibold">Drag background</span> → Pan around
        </p>
      </div>
      {isLoading && !isDemoMode && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-800 text-lg z-10">
          Loading...
        </div>
      )}
      {isError && !isDemoMode && (
        <div className="absolute inset-0 flex items-center justify-center text-red-600 text-lg z-10">
          <div className="text-center">
            <p>Error: {error?.message || "Failed to fetch team tree data"}</p>
            <button
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => refetch()}
              aria-label="Retry fetching team tree data"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      {((!isLoading && !isError && displayTreeData && displayTreeData.length > 0) || isDemoMode) && (
        <Tree
          data={displayTreeData || []}
          translate={translate}
          orientation="vertical"
          pathFunc="diagonal"
          collapsible={true}
          zoomable={true}
          draggable={true}
          renderCustomNodeElement={renderNodeWithCustomStyles}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          enableLegacyTransitions={false}
          shouldCollapseNeighborNodes={false}
          pathClassFunc={() => "custom-link-path"}
          zoom={0.8}
          initialDepth={1}
          scaleExtent={{ min: 0.1, max: 2 }}
        />

      )}
      {!isLoading && !isError && !isDemoMode && (!displayTreeData || displayTreeData.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-800 text-lg z-10">
          No team data available
        </div>
      )}
    </div>
  );
};

export default TeamTreeView;