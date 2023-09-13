import { useState,useEffect} from 'react';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import ContactsForm from './ContactsForm/ContactsForm';
import ContactList from './ContactList/ContactList';
import ContactsFilter from './ContactsFilter/ContactsFilter';

import styles from './phone-book.module.scss';


const PhoneBook = () => {
const [items,setItems] = useState(()=>{
  const items = JSON.parse(localStorage.getItem('my-contacts'));
  return items?.length ? items : [] ;
});
const [filter,setFilter] = useState("");

useEffect(()=>{
  localStorage.setItem('my-contacts', JSON.stringify(items));
},[items])

const isDublicate = (name) => {
  const normalizedName = name.toLowerCase();
  const contact = items.find(({ name }) => {
    return name.toLowerCase() === normalizedName;
  });
  return Boolean(contact);
}


const  addContact = ({ name, number }) => {
  if (isDublicate(name)) {
    Notify.warning(` ${name} is already in contacts`);
    return false;
  }
  setItems(prevContacts => {
    const newContact = {
      id: nanoid(),
      name,
      number,
    };
    return [newContact,...prevContacts];
  });
  return true;
};

const removeContact = (id) => {
  setItems( prevContacts => prevContacts.filter(item => item.id !== id) )
};

const  handleFilter = ({ target }) => setFilter(target.value);

const   getFilteredContacts = () => {
   if (!filter) {
    return items;
  }
  const normalizedFilter = filter.toLowerCase();
  const result = items.filter(({ name }) => {
    return name.toLowerCase().includes(normalizedFilter);
  });
  return result;
}

const filteredContacts = getFilteredContacts();
    const isContacts = Boolean(filteredContacts.length);

    return (
      <div>
        <div className={styles.wrapper}>
          <div className={styles.block}>
            <h2 className={styles.title}>Phonebook</h2>
            <ContactsForm onSubmit={addContact} />
          </div>
          <div className={styles.block}>
            <h2 className={styles.title}>Contacts</h2>
            <ContactsFilter handleChange={handleFilter} />
            {isContacts && (
              <ContactList removeContact={removeContact} items={filteredContacts} />
            )}
            {!isContacts && <p className={styles.notif}>No contacts in list</p>}
          </div>
        </div>
      </div>
    );

}

export default PhoneBook;


