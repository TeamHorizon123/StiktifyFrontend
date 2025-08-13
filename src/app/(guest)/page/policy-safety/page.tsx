import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Policy & Safety | Stiktify",
    description: "Community Policy & Safety on Stiktify.",
};

export default function PolicySafetyPage() {
    return (
        <div className="min-h-screen main-layout px-6 py-10 text-white">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Policy & Safety</h1>

                <section className="bg-[#18182c] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-2">Community Guidelines</h2>
                    <ul className="list-disc list-inside text-purple-300 space-y-1">
                        <li>Respect others; no harassment or bullying.</li>
                        <li>Do not share sensitive personal information publicly.</li>
                        <li>Report violating content for prompt action.</li>
                    </ul>
                </section>

                <section className="bg-[#18182c] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-2">Copyright</h2>
                    <p className="text-purple-300">
                        Respect intellectual property rights. If you are a content owner and find violations, please contact{" "}
                        <a className="text-purple-400 underline" href="mailto:copyright@stiktify.com">
                            copyright@stiktify.com
                        </a>.
                    </p>
                </section>

                <section className="bg-[#18182c] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-2">User Safety</h2>
                    <ul className="list-disc list-inside text-purple-300 space-y-1">
                        <li>Content moderation and reporting measures.</li>
                        <li>Support channel: <a className="text-purple-400 underline" href="mailto:safety@stiktify.com">safety@stiktify.com</a></li>
                    </ul>
                </section>
            </div>
        </div>
    );
}