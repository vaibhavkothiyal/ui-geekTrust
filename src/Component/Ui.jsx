import { useEffect, useState } from 'react'
import './Ui.css'
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

export const Ui = () => {
    const [usersData, setData] = useState(null);
    const [delDAta, setDelData] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 10;
    const [editWindow, setEditWindow] = useState(false)
    const [pageLimit, setPageLimit] = useState(null)
    const [toEditId, setToEdit] = useState(null);
    const [userInfoChange, setUserInfoChange] = useState({
        name: "",
        email: "",
        role: ""
    })

    const handleSearch = (e) => {
        const start = (page - 1) * 10;
        const end = page * limit
        fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
            .then(res => res.json())
            .then((res) => {
                res = res.filter((el) => {
                    if (el.name.includes(e) || el.email.includes(e) || el.role.includes(e)) {
                        return el;
                    }
                })
                let i = 1;
                setPageLimit(new Array(Math.ceil(res.length / 10)).fill().map(() => i++))

                res = res.slice(start, end)
                setData(res)
            })
            .catch(err => console.log(err.message))
    }

    const getUsersData = () => {
        const start = (page - 1) * 10;
        const end = page * limit
        fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
            .then(res => res.json())
            .then((res) => {
                let i = 1;
                setPageLimit(new Array(Math.ceil(res.length / 10)).fill().map(() => i++))

                res = res.slice(start, end)
                setData(res)
            })
            .catch(err => console.log(err.message))

        var inputs = document.getElementsByTagName('input');
        if (toggleState) {
            for (var i = 0; i < 12; i++) {
                if (inputs[i].type == 'checkbox') {
                    inputs[i].checked = false;
                }
            }
        }
    }

    const handlePageChange = (el) => {
        setPage(el)
    }

    const handleDelete = (idIs) => {
        setData(usersData.filter(el => el.id !== idIs))
    }

    const handleEdit = (el) => {
        setUserInfoChange({
            ...userInfoChange,
            name: el.name,
            email: el.email,
            role: el.role
        })
        setToEdit(el.id)
        setEditWindow(!editWindow)
    }

    const handleEditSubmit = () => {
        setEditWindow(!editWindow)
        setData(usersData.map((el) => {
            if (el.id == toEditId) {
                return {
                    ...el,
                    name: userInfoChange.name,
                    email: userInfoChange.email,
                    role: userInfoChange.role
                }
            } else return el
        }))
    }

    const handleInputChange = (e) => {
        const { value, name } = e.target
        setUserInfoChange({ ...userInfoChange, [name]: value })
    }

    useEffect(() => {
        getUsersData();
    }, [page])

    function debounce(e) {
        e.persist()
        setTimeout(() => {
            handleSearch(e.target.value)
        }, 600)
    }

    const deleteMultiple = () => {
        let map = {}
        for (let i = 0; i < delDAta.length; i++) {
            map[delDAta[i]] = 1;
        }
        setData(usersData.filter((el) => {
            if (!map[el.id]) return el;
        }))
        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == 'checkbox') {
                inputs[i].checked = false;
            }
        }
    }
    const [toggleState, setToggleState] = useState(false)
    const toggleSelected = () => {
        setToggleState(!toggleState)
        var inputs = document.getElementsByTagName('input');
        if (toggleState) {
            for (var i = 0; i < 12; i++) {
                if (inputs[i].type == 'checkbox') {
                    inputs[i].checked = false;
                }
            }
        } else {
            for (var i = 0; i < 12; i++) {
                if (inputs[i].type == 'checkbox') {
                    inputs[i].checked = true;
                }
            }
        }
    }

    return <>
        <div>
            <div><input onChange={debounce} className='SearchFiled' type="text" name="" id="" placeholder='Seach here' /></div>
            <div>
                <div className='UiColumnParent'>
                    <div className='UiColChild'><input onChange={toggleSelected} type="checkbox" name="" id="" /></div>
                    <div className='UiColChild'>Name</div>
                    <div className='UiColChild'>Email</div>
                    <div className='UiColChild'>Role</div>
                    <div className='UiColChild'>Action</div>
                </div>
            </div>
            {usersData && usersData.map((el) => (
                <div className='UiRowParent'>
                    <div className='UiRowChild'><input onChange={() => setDelData([...delDAta, el.id])} type="checkbox" name="checkbox" id="" /></div>
                    <div className="UiRowChild">{el.name}</div>
                    <div className="UiRowChild">{el.email}</div>
                    <div className="UiRowChild">{el.role}</div>
                    <div className="UiRowChild editDelete">
                        <div onClick={() => handleEdit(el)}><FaEdit className='editIcons iconEdit' /></div>
                        <div onClick={() => { handleDelete(el.id) }}><MdDelete className='editIcons iconDelete' /></div>
                    </div>
                </div>
            ))}
            <div>
                <div className='pageNavigaterContainer'>
                    <div><button className='DeleteBtn' onClick={deleteMultiple}>Delete Selected</button></div>
                    {usersData ? <div className='pageNavigaterParnet'>
                        <div style={page <= 1 ? { display: 'none' } : { display: 'block' }}
                        ><GrFormPrevious onClick={() => setPage(page - 1)} className='pageNvigate togglePage' /></div>
                        {Array.isArray(pageLimit) && pageLimit.length > 0 && pageLimit.map((el) => (
                            <div onClick={() => handlePageChange(el)} className='pageNvigate'>{el}</div>
                        ))}
                        <div style={page >= pageLimit.length ? { display: 'none' } : { display: 'block' }}
                        ><GrFormNext onClick={() => setPage(page + 1)} className='pageNvigate togglePage' /></div>
                    </div> : null}
                </div>
            </div>
            {editWindow ?
                <div className='infoEditDivContainer'>
                    <div className='infoEditDiv'>
                        <div><input onChange={handleInputChange} defaultValue={userInfoChange.name} type="text" name="name" id="" /></div>
                        <div><input onChange={handleInputChange} defaultValue={userInfoChange.email} type="text" name="email" id="" /></div>
                        <div><input onChange={handleInputChange} defaultValue={userInfoChange.role} type="text" name="role" id="" /></div>
                        <button className='submitBtn' onClick={() => handleEditSubmit()}>Submit</button>
                    </div>
                </div> : null
            }
        </div>
    </>
}