import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/index';
import MarketplaceItem from '@/lib/db/models/MarketplaceItem';
import { analyzeMarketplaceItem } from '@/lib/services/gemini';
import { fileToBase64 } from '@/lib/services/cloudinary';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'available';
    const category = searchParams.get('category');
    
    const filter: any = { status };
    if (category) filter.category = category;
    
    const items = await MarketplaceItem.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name');

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Get marketplace items error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const formData = await req.formData();
    const userId = formData.get('userId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const condition = formData.get('condition') as string;
    const type = formData.get('type') as string;
    const address = formData.get('address') as string;
    const imageFile = formData.get('image') as File;

    if (!userId || !title || !description || !imageFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert image to base64
    const imageBase64 = await fileToBase64(imageFile);

    // Analyze with AI
    const aiAnalysis = await analyzeMarketplaceItem(imageBase64, title, description);

    // Temporary image URL (replace with Cloudinary)
    const imageUrl = `data:image/jpeg;base64,${imageBase64}`;

    const item = new MarketplaceItem({
      userId,
      title,
      description,
      category,
      condition,
      type,
      images: [imageUrl],
      aiAnalysis,
      location: { address },
    });

    await item.save();

    return NextResponse.json({ success: true, item, aiAnalysis });
  } catch (error: any) {
    console.error('Create marketplace item error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
