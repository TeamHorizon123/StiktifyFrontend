import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Stiktify",
    description: "Stiktify's privacy policy.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen main-layout px-6 py-10 text-white">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Privacy Policy</h1>
                <section className="bg-[#18182c] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
                    <p className="text-purple-300">
                        We collect necessary information to operate our service: account, activity history, device, and cookies.
                    </p>
                </section>
                <section className="bg-[#18182c] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-2">How We Use Information</h2>
                    <ul className="list-disc list-inside text-purple-300 space-y-1">
                        <li>Personalize content and recommend videos/music.</li>
                        <li>Security, fraud prevention, and performance improvement.</li>
                    </ul>
                </section>
                <section className="bg-[#18182c] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
                    <ul className="list-disc list-inside text-purple-300 space-y-1">
                        <li>Access, edit, or delete your personal data (where applicable).</li>
                        <li>Disable non-essential cookies in your browser.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}