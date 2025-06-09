import React, { useState } from "react";

const mockEmails = [
  { id: 1, subject: "Welcome!", sender: "admin@gmail.com", body: "Hello and welcome!" },
  { id: 2, subject: "React Project", sender: "team@gmail.com", body: "Let's build something great." },
  // ...add more mock emails as needed
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Simple search in mock emails
    const filtered = mockEmails.filter(
      email =>
        email.subject.toLowerCase().includes(query.toLowerCase()) ||
        email.sender.toLowerCase().includes(query.toLowerCase()) ||
        email.body.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="container mt-5">
      <h2>Search Emails</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by subject, sender, or body"
          className="form-control mb-2"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>
      <ul className="list-group mt-3">
        {results.map(email => (
          <li key={email.id} className="list-group-item">
            <strong>{email.subject}</strong> from {email.sender}
            <div>{email.body}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
