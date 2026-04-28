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

    const prompt = `You are a helpful assistant analyzing tenant reviews for a property in Lagos, Nigeria. Based on the following reviews, generate a concise 2-3 sentence summary that:
1. Highlights the main advantages and disadvantages.
2. Gives a clear recommendation: should someone rent this property or avoid it?
Be direct and helpful. Respond with just the summary paragraph, no preamble.

Reviews:
${reviewText}`;

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
      // Fallback: generate simple summary manually
      const categoryCounts: Record<string, number> = {};
      reviews.forEach((r) => {
        r.categories.forEach((cat) => {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
      });

      const topPositive = Object.entries(categoryCounts)
        .filter(([cat]) => !cat.toLowerCase().includes('issue') && !cat.toLowerCase().includes('problem'))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat]) => cat.toLowerCase().replace(/_/g, ' '))
        .join(', ');

      const topNegative = Object.entries(categoryCounts)
        .filter(([cat]) => cat.toLowerCase().includes('issue') || cat.toLowerCase().includes('problem'))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat]) => cat.toLowerCase().replace(/_/g, ' '))
        .join(', ');

      let recommendation = 'It is recommended to avoid this property.';
      if (topPositive && !topNegative) recommendation = 'This property seems good to rent.';
      else if (topPositive && topNegative) recommendation = 'Consider the positives and negatives before deciding.';

      return NextResponse.json({
        summary: `This property has ${reviews.length} review(s). Advantages: ${topPositive || 'None'}. Disadvantages: ${topNegative || 'None'}. ${recommendation}`,
      });
    }

    const data = await response.json();
    const summary = data.content?.[0]?.text || 'Summary unavailable.';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI summary error:', error);

    // Safe fallback
    return NextResponse.json({
      summary:
        'Summary could not be generated at this time. Please check the reviews manually.',
    });
  }
}