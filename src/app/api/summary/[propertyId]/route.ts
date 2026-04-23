import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { propertyId: string } },
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { propertyId: params.propertyId },
      select: { categories: true, comment: true },
    });

    if (reviews.length === 0) {
      return NextResponse.json({
        summary:
          'No reviews yet. Be the first to share your experience with this property.',
      });
    }

    const reviewText = reviews
      .map((r) => `[${r.categories.join(', ')}]: ${r.comment}`)
      .join('\n');

    const prompt = `You are a helpful assistant analyzing tenant reviews for a property in Lagos, Nigeria. Based on the following reviews, generate a concise 2-3 sentence summary highlighting the most important issues and positives. Be direct and helpful for someone considering renting this property.

Reviews:
${reviewText}

Respond with just the summary paragraph, no preamble.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      // Fallback to simple summary
      const categoryCounts: Record<string, number> = {};
      reviews.forEach((r) => {
        r.categories.forEach((cat) => {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
      });
      const topIssues = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat]) => cat.toLowerCase().replace(/_/g, ' '))
        .join(', ');
      return NextResponse.json({
        summary: `This property has ${reviews.length} review(s). Common themes include: ${topIssues}.`,
      });
    }

    const data = await response.json();
    const summary = data.content?.[0]?.text || 'Summary unavailable.';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI summary error:', error);
    return NextResponse.json({
      summary: 'Summary could not be generated at this time.',
    });
  }
}