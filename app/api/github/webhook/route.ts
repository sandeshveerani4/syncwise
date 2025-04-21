import { NextResponse } from "next/server";
import crypto from "crypto";

// GitHub webhook secret for verifying webhook payloads
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    // Verify the webhook signature
    const signature = req.headers.get("x-hub-signature-256");
    const body = await req.text();

    if (!verifyWebhookSignature(signature, body)) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = req.headers.get("x-github-event");
    const payload = JSON.parse(body);

    console.log(`Received GitHub webhook: ${event}`);

    // Handle different webhook events
    switch (event) {
      case "installation":
        await handleInstallationEvent(payload);
        break;
      case "push":
        await handlePushEvent(payload);
        break;
      case "issues":
        await handleIssuesEvent(payload);
        break;
      case "pull_request":
        await handlePullRequestEvent(payload);
        break;
      // Add more event handlers as needed
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing GitHub webhook:", error);
    return NextResponse.json(
      { message: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Verify the webhook signature
function verifyWebhookSignature(
  signature: string | null,
  payload: string
): boolean {
  if (!signature || !GITHUB_WEBHOOK_SECRET) return false;

  const hmac = crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(payload).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

// Handle installation events (app installed or uninstalled)
async function handleInstallationEvent(payload: any) {
  const action = payload.action;
  const installationId = payload.installation.id;

  if (action === "created") {
    console.log(`GitHub App installed: Installation ID ${installationId}`);
    // Store installation information in your database
  } else if (action === "deleted") {
    console.log(`GitHub App uninstalled: Installation ID ${installationId}`);
    // Remove installation information from your database
  }
}

// Handle push events
async function handlePushEvent(payload: any) {
  const repo = payload.repository.full_name;
  const branch = payload.ref.replace("refs/heads/", "");
  const commits = payload.commits;

  console.log(`Push to ${repo}/${branch}: ${commits.length} commits`);
  // Process the push event (e.g., trigger a build, update status)
}

// Handle issues events
async function handleIssuesEvent(payload: any) {
  const action = payload.action;
  const issue = payload.issue;
  const repo = payload.repository.full_name;

  console.log(`Issue ${action}: ${repo}#${issue.number} - ${issue.title}`);
  // Process the issue event (e.g., create a task, update status)
}

// Handle pull request events
async function handlePullRequestEvent(payload: any) {
  const action = payload.action;
  const pr = payload.pull_request;
  const repo = payload.repository.full_name;

  console.log(`Pull request ${action}: ${repo}#${pr.number} - ${pr.title}`);
  // Process the pull request event (e.g., trigger a review, update status)
}
