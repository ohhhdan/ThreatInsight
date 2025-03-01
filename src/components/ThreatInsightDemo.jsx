import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Shield,
  AlertTriangle,
  Activity,
  Globe,
  Clock,
  Users,
} from "lucide-react";

const ThreatInsightDemo = () => {
  const [attackCount, setAttackCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [currentAttack, setCurrentAttack] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(
    "credential_stuffing"
  );

  const attackScenarios = {
    credential_stuffing: {
      name: "Credential Stuffing Attack",
      patterns: [
        {
          message: "Multiple login attempts detected from distributed IPs",
          delay: 1000,
        },
        {
          message: "High velocity authentication requests identified",
          delay: 800,
        },
        {
          message: "Known compromised credentials detected in attempts",
          delay: 1200,
        },
        {
          message:
            "Attack blocked - No authentication attempts reached the server",
          delay: 1000,
        },
      ],
      metrics: {
        velocity: "350 attempts/minute",
        sources: "1,200+ unique IPs",
        credentials: "Known compromised",
        risk_level: "Critical",
      },
    },
    password_spray: {
      name: "Password Spray Attack",
      patterns: [
        {
          message: "Low velocity authentication attempts detected",
          delay: 1000,
        },
        {
          message: "Common password pattern identified across attempts",
          delay: 1200,
        },
        { message: "Suspicious IP rotation pattern detected", delay: 800 },
        {
          message: "Attack blocked - Password spray attempt prevented",
          delay: 1000,
        },
      ],
      metrics: {
        velocity: "60 attempts/minute",
        sources: "500+ unique IPs",
        credentials: "Common passwords",
        risk_level: "High",
      },
    },
    brute_force: {
      name: "Brute Force Attack",
      patterns: [
        {
          message: "Rapid sequential authentication attempts detected",
          delay: 800,
        },
        {
          message: "Systematic password variation pattern identified",
          delay: 1000,
        },
        {
          message: "Single source IP attempting multiple accounts",
          delay: 1200,
        },
        {
          message: "Attack blocked - Brute force attempt prevented",
          delay: 1000,
        },
      ],
      metrics: {
        velocity: "600 attempts/minute",
        sources: "Single IP",
        credentials: "Sequential attempts",
        risk_level: "Critical",
      },
    },
    automated_bot: {
      name: "Automated Bot Attack",
      patterns: [
        { message: "Non-human behavior pattern detected", delay: 1000 },
        { message: "Suspicious header patterns identified", delay: 800 },
        { message: "Abnormal request timing detected", delay: 1200 },
        { message: "Attack blocked - Bot activity prevented", delay: 1000 },
      ],
      metrics: {
        velocity: "250 attempts/minute",
        sources: "800+ unique IPs",
        credentials: "Mixed patterns",
        risk_level: "High",
      },
    },
  };

  const addAlert = (message, type = "block") => {
    const newAlert = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 8));
  };

  const simulateAttack = async () => {
    if (isSimulating) return;

    setIsSimulating(true);
    const scenario = attackScenarios[selectedScenario];
    setCurrentAttack(scenario);
    setAttackCount((prev) => prev + 1);

    for (const pattern of scenario.patterns) {
      addAlert(pattern.message);
      await new Promise((resolve) => setTimeout(resolve, pattern.delay));
    }

    setBlockedCount((prev) => prev + 1);
    setIsSimulating(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>ThreatInsight Attack Simulator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-100 rounded">
              <div className="text-2xl font-bold">{attackCount}</div>
              <div className="text-sm">Attacks Detected</div>
            </div>
            <div className="text-center p-4 bg-green-100 rounded">
              <div className="text-2xl font-bold">{blockedCount}</div>
              <div className="text-sm">Attacks Blocked</div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-yellow-100 rounded">
              <div className="text-2xl font-bold">0ms</div>
              <div className="text-sm">Avg Response Time</div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Select Attack Scenario:
            </label>
            <select
              className="w-full p-2 border rounded"
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              disabled={isSimulating}
            >
              {Object.entries(attackScenarios).map(([key, scenario]) => (
                <option key={key} value={key}>
                  {scenario.name}
                </option>
              ))}
            </select>
          </div>

          {currentAttack && (
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <h3 className="font-bold mb-2">Current Attack Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  <span>Velocity: {currentAttack.metrics.velocity}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>Sources: {currentAttack.metrics.sources}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Credentials: {currentAttack.metrics.credentials}</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Risk Level: {currentAttack.metrics.risk_level}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={simulateAttack}
            disabled={isSimulating}
            className="w-full p-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 mb-6"
          >
            {isSimulating ? "Attack in Progress..." : "Simulate Attack"}
          </button>

          <div className="mt-4">
            <h3 className="font-bold mb-2">Activity Log</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alerts.map((alert) => (
                <Alert key={alert.id} className="bg-gray-50">
                  <AlertDescription className="flex items-center">
                    <Shield className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      {alert.timestamp}
                    </span>
                    <span className="text-sm ml-2">{alert.message}</span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatInsightDemo;
