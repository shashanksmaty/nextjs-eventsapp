import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "@/config/index";

export default function EventPage({ event }) {
    const router = useRouter();
    const deleteEvent = async (e) => {
        if (confirm("Are you sure you want to delete this event?")) {
            const res = await fetch(`${API_URL}/events/${event.id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
            } else {
                router.push("/events");
            }
        }
    };
    return (
        <Layout>
            <div className="row mt-4 justify-content-center">
                <div className="col-md-10 d-flex flex-row-reverse">
                    <Link href={`/events/edit/${event.id}`}>
                        <a className="btn btn-sm btn-outline-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-pencil"
                                viewBox="0 0 16 16"
                            >
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>{" "}
                            Edit Event
                        </a>
                    </Link>
                    <a
                        href="#"
                        className="btn btn-sm btn-outline-danger me-3"
                        onClick={deleteEvent}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                        >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path
                                fill-rule="evenodd"
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                            />
                        </svg>{" "}
                        Delete Event
                    </a>
                </div>
                <div className="col-md-10">
                    <h4 className="text-muted">
                        {new Date(event.date).toDateString("en-US")} at{" "}
                        {event.time}
                    </h4>
                    <h2 className="mb-3">{event.name}</h2>
                    <ToastContainer position="top-center" />
                    <img
                        src={
                            event.image
                                ? event.image.formats.medium.url
                                : "/images/default.jpg"
                        }
                        className="img-fluid"
                    />
                    <h3 className="mt-3">Performers:</h3>
                    <p>{event.performers}</p>
                    <h3>Description:</h3>
                    <p>{event.description}</p>
                    <h3>Venue:</h3>
                    <p>{event.venue}</p>
                    <Link href="/">
                        <a>{"<"} Go Back</a>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

export async function getStaticPaths() {
    const res = await fetch(`${API_URL}/events`);
    const events = await res.json();

    const paths = events.map((item) => ({
        params: { slug: item.slug },
    }));

    return {
        paths: paths,
        fallback: true,
    };
}

export async function getStaticProps({ params: { slug } }) {
    const res = await fetch(`${API_URL}/events?slug=${slug}`);
    const events = await res.json();

    return {
        props: {
            event: events[0],
        },
        revalidate: 1,
    };
}

/* export async function getServerSideProps({ query: { slug } }) {
    const res = await fetch(`${API_URL}/api/events/${slug}`);
    const events = await res.json();

    return {
        props: {
            event: events[0],
        },
    };
} */
