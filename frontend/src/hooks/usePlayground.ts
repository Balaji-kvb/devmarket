"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/providers/ToastProvider";
import { sendPlaygroundRequest } from "@/lib/http-client";
import { formatJSON, minifyJSON, validateJSON } from "@/lib/json-utils";
import { buildHeaders, getBodySizeLabel, isBodyMethod, normalizeUrl, validateUrl } from "@/lib/request-utils";
import { useRequestHistory } from "@/hooks/useRequestHistory";
import type { HttpMethod, JSONValidationResult, KeyValuePair, PlaygroundHistory, PlaygroundRequest, PlaygroundResponse } from "@/types";

const DEFAULT_HEADERS: KeyValuePair[] = [
  { key: "Accept", value: "application/json", enabled: true },
];

const DEFAULT_REQUEST: PlaygroundRequest = {
  method: "GET",
  url: "https://api.example.com/v1/resource",
  headers: DEFAULT_HEADERS,
  body: "",
  authType: "none",
  authValue: "",
};

export function usePlayground() {
  const { toast } = useToast();
  const { history, saveHistoryItem, deleteHistoryItem, clearHistory, getHistoryItem } = useRequestHistory();

  const [method, setMethod] = useState<HttpMethod>(DEFAULT_REQUEST.method);
  const [url, setUrl] = useState(DEFAULT_REQUEST.url);
  const [headers, setHeaders] = useState<KeyValuePair[]>(DEFAULT_HEADERS);
  const [authType, setAuthType] = useState<PlaygroundRequest["authType"]>("none");
  const [authValue, setAuthValue] = useState("");
  const [body, setBody] = useState(DEFAULT_REQUEST.body);
  const [validation, setValidation] = useState<JSONValidationResult>({ valid: true });
  const [response, setResponse] = useState<PlaygroundResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"response" | "history">("response");

  const normalizedUrl = useMemo(() => normalizeUrl(url), [url]);
  const urlValid = useMemo(() => validateUrl(url), [url]);
  const bodyEnabled = useMemo(() => isBodyMethod(method), [method]);
  const bodySize = useMemo(() => getBodySizeLabel(body), [body]);

  useEffect(() => {
    if (!bodyEnabled) {
      setBody("");
      setValidation({ valid: true });
    }
  }, [bodyEnabled]);

  const setHeaderAtIndex = useCallback((index: number, next: KeyValuePair) => {
    setHeaders((current) => current.map((item, idx) => (idx === index ? next : item)));
  }, []);

  const addHeader = useCallback(() => {
    setHeaders((current) => [...current, { key: "", value: "", enabled: true }]);
  }, []);

  const removeHeader = useCallback((index: number) => {
    setHeaders((current) => current.filter((_, idx) => idx !== index));
  }, []);

  const runValidation = useCallback((payload: string) => {
    const result = validateJSON(payload);
    setValidation(result);
    return result;
  }, []);

  const formatRequestBody = useCallback(() => {
    try {
      const formatted = formatJSON(body);
      setBody(formatted);
      setValidation({ valid: true });
    } catch (error) {
      const result = runValidation(body);
      toast(result.error?.message ?? "Unable to format JSON.", "error");
    }
  }, [body, runValidation, toast]);

  const minifyRequestBody = useCallback(() => {
    try {
      const minified = minifyJSON(body);
      setBody(minified);
      setValidation({ valid: true });
    } catch (error) {
      const result = runValidation(body);
      toast(result.error?.message ?? "Unable to minify JSON.", "error");
    }
  }, [body, runValidation, toast]);

  const sendRequest = useCallback(async () => {
    if (!url.trim()) {
      setErrorMessage("Enter a valid API endpoint.");
      setResponse(null);
      return;
    }

    if (!urlValid) {
      setErrorMessage("The URL format is invalid. Make sure it starts with http:// or https://.");
      setResponse(null);
      return;
    }

    if (bodyEnabled && body.trim()) {
      const validationResult = runValidation(body);
      if (!validationResult.valid) {
        setErrorMessage("Request body must be valid JSON before sending.");
        setResponse(null);
        return;
      }
    }

    setErrorMessage(null);
    setIsLoading(true);

    const request: PlaygroundRequest = {
      method,
      url: normalizedUrl,
      headers,
      body: bodyEnabled ? body : "",
      authType,
      authValue,
    };

    const timestamp = new Date().toISOString();

    try {
      const result = await sendPlaygroundRequest(request);
      setResponse(result);
      saveHistoryItem({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        method,
        url: normalizedUrl,
        statusCode: result.status,
        responseTime: result.responseTime,
        requestBody: request.body || undefined,
        timestamp,
      });
      setActiveTab("response");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network request failed.";
      setErrorMessage(message);
      setResponse(null);
      saveHistoryItem({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        method,
        url: normalizedUrl,
        statusCode: 0,
        responseTime: 0,
        requestBody: request.body || undefined,
        timestamp,
      });
    } finally {
      setIsLoading(false);
    }
  }, [authType, authValue, body, bodyEnabled, headers, method, normalizedUrl, runValidation, saveHistoryItem, toast, urlValid]);

  const restoreHistoryItem = useCallback(
    (historyId: string) => {
      const item = getHistoryItem(historyId);
      if (!item) return;
      setMethod(item.method);
      setUrl(item.url);
      setBody(item.requestBody ?? "");
      setActiveTab("response");
      setErrorMessage(null);
      toast("Request restored from history.", "info");
    },
    [getHistoryItem, toast]
  );

  return {
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
  };
}
