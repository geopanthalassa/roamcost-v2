import { redirect } from 'next/navigation';

export default async function CostOfLivingRedirect({ params }: { params: Promise<{ city: string }> }) {
    const { city } = await params;
    redirect(`/city/${city}`);
}
