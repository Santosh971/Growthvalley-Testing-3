import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-config";

// API URL configuration

// Validation helpers
const validators = {
  // Name: required, only letters, spaces, hyphens, and apostrophes
  name: (value: string): string | null => {
    if (!value || typeof value !== 'string') {
      return "Name is required";
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return "Name is required";
    }
    if (trimmed.length > 100) {
      return "Name must be less than 100 characters";
    }
    // Allow letters (including Unicode), spaces, hyphens, and apostrophes
    if (!/^[\p{L}\s\-']+$/u.test(trimmed)) {
      return "Name can only contain letters, spaces, and hyphens";
    }
    return null;
  },

  // Email: required, valid email format
  email: (value: string): string | null => {
    if (!value || typeof value !== 'string') {
      return "Email is required";
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return "Email is required";
    }
    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address";
    }
    if (trimmed.length > 254) {
      return "Email must be less than 254 characters";
    }
    return null;
  },

  // Phone: optional, Indian mobile number format
  // Accepts: +91-XXXXXXXXXX, +91 XXXXXXXXXX, +91XXXXXXXXXX, XXXXXXXXXX (10 digits)
  phone: (value: string | undefined): string | null => {
    if (!value) return null; // Optional field
    const trimmed = value.trim();
    if (trimmed.length === 0) return null;

    // Remove all spaces and hyphens for validation
    const cleaned = trimmed.replace(/[\s\-]/g, '');

    // Indian mobile number patterns:
    // +91XXXXXXXXXX (12 chars with country code)
    // XXXXXXXXXX (10 digits)
    // XXXXXXXXXX (with leading 0)
    const indianPhoneRegex = /^(\+91|0)?[6-9]\d{9}$/;

    if (!indianPhoneRegex.test(cleaned)) {
      return "Please enter a valid Indian mobile number";
    }
    return null;
  },

  // Message: required, minimum 10 characters
  message: (value: string): string | null => {
    if (!value || typeof value !== 'string') {
      return "Message is required";
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return "Message is required";
    }
    if (trimmed.length < 10) {
      return "Message must be at least 10 characters";
    }
    if (trimmed.length > 5000) {
      return "Message must be less than 5000 characters";
    }
    return null;
  },
};

// Validate all fields and return array of errors
function validateContactForm(data: Record<string, unknown>): string[] {
  const errors: string[] = [];

  const nameError = validators.name(data.name as string);
  if (nameError) errors.push(nameError);

  const emailError = validators.email(data.email as string);
  if (emailError) errors.push(emailError);

  const phoneError = validators.phone(data.phone as string);
  if (phoneError) errors.push(phoneError);

  const messageError = validators.message(data.message as string);
  if (messageError) errors.push(messageError);

  return errors;
}

export async function POST(request: NextRequest) {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return NextResponse.json(
      { message: "Server configuration error. Please try again later." },
      { status: 500 }
    );
  }

  try {
    // Parse request body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate input
    const errors = validateContactForm(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { message: errors[0], errors },
        { status: 400 }
      );
    }

    // Map frontend fields to backend expected fields
    const backendPayload = {
      name: (body.name as string).trim(),
      email: (body.email as string).trim(),
      phone: body.phone ? (body.phone as string).trim() : '',
      company: body.company ? (body.company as string).trim() : '',
      interest: body.interest ? (body.interest as string).trim() : '',
      message: (body.message as string).trim(),
      source: 'website',
    };

    // Forward to backend API
    const backendUrl = `${apiUrl}/api/contact`;
    console.log("Forwarding contact form to:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendPayload),
    });

    // Try to parse response
    let data: Record<string, unknown>;
    try {
      data = await response.json();
    } catch {
      console.error("Failed to parse backend response");
      return NextResponse.json(
        { message: "Server error. Please try again later." },
        { status: 500 }
      );
    }

    // Handle backend error responses
    if (!response.ok) {
      console.error("Backend error:", data);
      return NextResponse.json(
        { message: (data.error as string) || "Failed to submit form. Please try again." },
        { status: response.status }
      );
    }

    // Success response - return backend's message
    return NextResponse.json(
      { message: data.message || "Thank you for your enquiry. We will get back to you soon." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact API error:", error);

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { message: "Unable to connect to server. Please check your internet connection and try again." },
        { status: 503 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}