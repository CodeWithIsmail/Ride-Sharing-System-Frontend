import { useState } from "react";
import {
  checkBackendHealth,
  testAuthEndpoints,
} from "../utils/backendHealthCheck";

const DebugPage = () => {
  const [debugResults, setDebugResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    setDebugResults(null);

    try {
      const health = await checkBackendHealth();
      const endpoints = await testAuthEndpoints();

      // Test actual login with invalid credentials to see response
      const testLogin = async () => {
        try {
          const response = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "test@test.com",
              password: "wrongpassword",
            }),
          });

          const data = await response.text();
          return {
            status: response.status,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
            body: data,
          };
        } catch (error) {
          return {
            error: error.message,
            code: error.code,
          };
        }
      };

      const loginTest = await testLogin();

      setDebugResults({
        backendHealth: health,
        authEndpoints: endpoints,
        loginTest,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setDebugResults({
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-bug me-2"></i>
                Debug Information
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                This page helps diagnose login and registration issues by
                testing backend connectivity and API endpoints.
              </p>

              <button
                className="btn btn-primary"
                onClick={runDiagnostics}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Running Diagnostics...
                  </>
                ) : (
                  <>
                    <i className="fas fa-play me-2"></i>
                    Run Diagnostics
                  </>
                )}
              </button>

              {debugResults && (
                <div className="mt-4">
                  <h6>Diagnostic Results</h6>
                  <small className="text-muted">
                    Generated: {debugResults.timestamp}
                  </small>

                  <div className="mt-3">
                    <pre
                      className="bg-light p-3 rounded"
                      style={{
                        fontSize: "0.875rem",
                        maxHeight: "500px",
                        overflow: "auto",
                      }}
                    >
                      {JSON.stringify(debugResults, null, 2)}
                    </pre>
                  </div>

                  {/* Quick Summary */}
                  <div className="mt-3">
                    <h6>Quick Summary</h6>
                    <ul className="list-unstyled">
                      <li>
                        <strong>Backend Status:</strong>{" "}
                        <span
                          className={
                            debugResults.backendHealth?.status === "online"
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {debugResults.backendHealth?.status || "Unknown"}
                        </span>
                      </li>
                      {debugResults.authEndpoints && (
                        <li>
                          <strong>Auth Endpoints:</strong>
                          <ul className="ms-3">
                            {Object.entries(debugResults.authEndpoints).map(
                              ([endpoint, status]) => (
                                <li key={endpoint}>
                                  {endpoint}:{" "}
                                  <span
                                    className={
                                      status.includes("✅")
                                        ? "text-success"
                                        : "text-danger"
                                    }
                                  >
                                    {status}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </li>
                      )}
                      {debugResults.loginTest && (
                        <li>
                          <strong>Login Test:</strong>{" "}
                          {debugResults.loginTest.error ? (
                            <span className="text-danger">
                              Failed - {debugResults.loginTest.error}
                            </span>
                          ) : (
                            <span className="text-success">
                              Responded with status{" "}
                              {debugResults.loginTest.status}
                            </span>
                          )}
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-3">
                    <h6>Recommendations</h6>
                    <div className="alert alert-info">
                      {debugResults.backendHealth?.status !== "online" ? (
                        <div>
                          <strong>Backend is not running:</strong>
                          <ul className="mb-0 mt-2">
                            <li>
                              Make sure your backend server is started on port
                              3001
                            </li>
                            <li>
                              Check if the backend URL is correct:
                              http://localhost:3001
                            </li>
                            <li>
                              Verify there are no firewall or port conflicts
                            </li>
                          </ul>
                        </div>
                      ) : debugResults.loginTest?.error ? (
                        <div>
                          <strong>Network/CORS issues detected:</strong>
                          <ul className="mb-0 mt-2">
                            <li>Check CORS configuration on your backend</li>
                            <li>
                              Verify the backend is accepting requests from this
                              domain
                            </li>
                            <li>
                              Check browser developer tools for CORS errors
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div>
                          <strong>Backend appears to be working:</strong>
                          <ul className="mb-0 mt-2">
                            <li>API endpoints are responding correctly</li>
                            <li>
                              Check the browser console for client-side errors
                            </li>
                            <li>Verify form data is being sent correctly</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
