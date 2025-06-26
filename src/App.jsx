import { use, useState } from "react";

// const initialFriends = [
//   {
//     id: 118836,
//     name: "Clark",
//     image: "https://i.pravatar.cc/48?u=118836",
//     balance: -7,
//   },
//   {
//     id: 933372,
//     name: "Sarah",
//     image: "https://i.pravatar.cc/48?u=933372",
//     balance: 20,
//   },
//   {
//     id: 499476,
//     name: "Anthony",
//     image: "https://i.pravatar.cc/48?u=499476",
//     balance: 0,
//   },
// ];

export default function App() {
  const [initialFriends, setInitialFriends] = useState([
    {
      id: 118836,
      name: "Clark",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: -7,
    },
    {
      id: 933372,
      name: "Sarah",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 20,
    },
    {
      id: 499476,
      name: "Anthony",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
    },
  ]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriendd, setSelectedFriend] = useState(null);

  function handleAddFriend() {
    setShowAddFriend(!showAddFriend);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  // function handleSplit(e, id, amount1, amount2, person) {
  //   e.preventDefault();
  //   const f = initialFriends.filter((f) => f.id === id);
  //   const [fr] = f;
  //   // console.log(fr);
  //   const { name, balance } = fr;
  //   // console.log(name);
  //   let balance2;

  //   if (name === person) {
  //     balance2 = balance + amount1;
  //   } else {
  //     balance2 = balance - amount2;
  //   }

  //   setInitialFriends((f) =>
  //     f.map((f) => (f.id === id ? { ...f, balance: balance2 } : f))
  //   );
  // }

  function handleSplitBill(value) {
    setInitialFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriendd.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    // setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={initialFriends}
          selectedFriendd={selectedFriendd}
          onSelect={handleSelectFriend}
        />
        {showAddFriend && (
          <FormAddFriend
            friends={initialFriends}
            onAddFriend={setInitialFriends}
            onShowAddFriend={setShowAddFriend}
          />
        )}
        <Button onClick={handleAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriendd ? (
        <FormSplitBill
          selectedFriendd={selectedFriendd}
          onSplit={handleSplitBill}
        />
      ) : null}
    </div>
  );
}

function FriendsList({ friends, selectedFriendd, onSelect }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriendd={selectedFriendd}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriendd, onSelect }) {
  const isSelected = selectedFriendd?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && (
        <p className="red">You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend, onShowAddFriend }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !url) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${url}?=${id}`,
      balance: 0,
    };

    onAddFriend((f) => [...f, newFriend]);

    setName("");
    setUrl("https://i.pravatar.cc/48");

    onShowAddFriend(false);
  }

  return (
    <form action="" className="form-add-friend" onSubmit={handleSubmit}>
      <label htmlFor="">🧑‍🤝‍🧑 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="">🌄 Image URL</label>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriendd, onSplit }) {
  const [bill, setBill] = useState(0);
  const [userExepense, setUserExpense] = useState(0);
  const [payer, setPayer] = useState("user");
  const friendExepnse = bill ? Number(bill) - Number(userExepense) : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userExepense) return;
    onSplit(payer === "user" ? friendExepnse : -userExepense);
  }

  return (
    <form
      action=""
      className="form-split-bill"
      onSubmit={(e) => handleSubmit(e)}
    >
      <h2>Split a bill with {selectedFriendd.name}</h2>

      <label htmlFor="">🧑‍🤝‍🧑 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <label htmlFor="">🧑‍🤝‍🧑 Your expense</label>
      <input
        type="text"
        value={userExepense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill
              ? userExepense
              : Number(e.target.value)
          )
        }
      />

      <label htmlFor="">🧑‍🤝‍🧑 {selectedFriendd.name}'s expense</label>
      <input type="text" disabled value={friendExepnse} />

      <label>Who is paying the Bill</label>
      <select
        name=""
        id=""
        value={payer}
        onChange={(e) => setPayer(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriendd.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
