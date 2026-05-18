"use client";

import { useMemo } from "react";
import { usePlayground } from "@/hooks/usePlayground";
import { MethodSelector } from "@/components/playground/MethodSelector";
import { URLBar } from "@/components/playground/URLBar";
import { HeaderEditor } from "@/components/playground/HeaderEditor";
import { RequestBodyEditor } from "@/components/playground/RequestBodyEditor";
import { JSONFormatter } from "@/components/playground/JSONFormatter";
import { ResponseViewer } from "@/components/playground/ResponseViewer";
import { RequestHistory } from "@/components/playground/RequestHistory";
import { PlaygroundTabs } from "@/components/playground/PlaygroundTabs";
import { EmptyResponse } from "@/components/playground/EmptyResponse";

export function PlaygroundShell() {
  const {
    method,
    setMethod,
    url,
    setUrl,
    headers,
    setHeaderAtIndex,
    addHeader,
    removeHeader,
    authType,
    setAuthType,
    authValue,
    setAuthValue,
    body,
    setBody,
    validation,
    response,
    errorMessage,
    isLoading,
    activeTab,
    setActiveTab,
    history,
    sendRequest,
    formatRequestBody,
    minifyRequestBody,
    runValidation,
    restoreHistoryItem,
    deleteHistoryItem,
    clearHistory,
    bodyEnabled,
    bodySize,
    urlValid,
  } = usePlayground();

  const responseLabel = useMemo(
    () => (response ? `${response.status} ${response.statusText}` : "No response yet"),
    [response]
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-400">API Playground</p>
          <h1 className="text-3xl font-semibold text-text-primary sm:text-4xl">Build, test, and inspect live API requests</h1>
          <p className="max-w-3xl text-sm text-text-secondary">
            Send HTTP requests, manage headers, validate JSON, and track your recent requests in a polished developer playground.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="glass-card border-white/[0.06] p-6 space-y-6">
              <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)] xl:items-end">
                <MethodSelector value={method} onChange={setMethod} />
                <URLBar
                  value={url}
                  onChange={setUrl}
                  onSubmit={sendRequest}
                  loading={isLoading}
                  valid={urlValid}
                />
              </div>

              <HeaderEditor
                headers={headers}
                onHeaderChange={setHeaderAtIndex}
                onAddHeader={addHeader}
                onRemoveHeader={removeHeader}
                authType={authType}
                authValue={authValue}
                onAuthTypeChange={setAuthType}
                onAuthValueChange={setAuthValue}
              />

              <RequestBodyEditor
                body={body}
                onChange={setBody}
                disabled={!bodyEnabled}
                validation={validation}
                sizeLabel={bodySize}
                onValidate={() => runValidation(body)}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={sendRequest}
                  disabled={isLoading}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-black transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Sending request…" : "Send request"}
                </button>
                <button
                  type="button"
                  onClick={formatRequestBody}
                  disabled={!bodyEnabled || isLoading}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-semibold text-text-primary transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Format request JSON
                </button>
              </div>

              {errorMessage ? (
                <div className="rounded-3xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
                  {errorMessage}
                </div>
              ) : null}
            </div>

            <JSONFormatter
              value={body}
              onChange={setBody}
              onFormat={formatRequestBody}
              onMinify={minifyRequestBody}
              onValidate={() => runValidation(body)}
              validation={validation}
              disabled={!bodyEnabled}
            />
          </div>

          <div className="space-y-6">
            <div className="glass-card border-white/[0.06] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-text-muted">Response inspector</p>
                  <h2 className="text-xl font-semibold text-text-primary">{responseLabel}</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-xs uppercase tracking-[0.24em] text-text-muted">
                    {isLoading ? "Loading…" : response ? `${response.responseTime} ms` : "Ready"}
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-xs uppercase tracking-[0.24em] text-text-muted">
                    {response ? `${response.size} bytes` : "No payload"}
                  </span>
                </div>
              </div>

              <PlaygroundTabs active={activeTab} onChange={setActiveTab} />

              {activeTab === "response" ? (
                <ResponseViewer response={response} loading={isLoading} />
              ) : (
                <RequestHistory
                  history={history}
                  onRestore={restoreHistoryItem}
                  onDelete={deleteHistoryItem}
                  onClear={clearHistory}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
