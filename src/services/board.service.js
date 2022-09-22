import { httpService } from './http.service.js'

// const STORAGE_KEY = 'board'
const BASE_URL = `board/`

export const boardService = {
  query,
  getById,
  save,
  remove,
  handleDragEnd,
}

async function query(filterBy) {
  try {
    return await httpService.get(BASE_URL, filterBy)
    // let boards = await storageService.query(STORAGE_KEY)
    // if (!boards || !boards.length) {
    // storageService.postMany(STORAGE_KEY, gBoards)
    // boards = gBoards
    // }
    // return boards
  } catch (err) {
    console.log('err: Cannot get boards ', err)
  }
}

function getById(boardId) {
  return httpService.get(BASE_URL + boardId)
  // return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
  return httpService.delete(BASE_URL + boardId)
  // await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {
  if (board._id) {
    console.log('INSIDE PUT')
    return httpService.put(BASE_URL + board._id, board)
    // return await storageService.put(STORAGE_KEY, board)
  } else {
    console.log('INSIDE POST')
    return httpService.post(BASE_URL, board)
    // return await storageService.post(STORAGE_KEY, board)
  }
}

function handleDragEnd(newBoard, destination, source, type) {
  const newBoardGroups = Array.from(newBoard.groups) // breaks pointer so we don't change the final object we send

  // reorder groups in the group list
  if (type === 'group') {
    // relocating the group in the groups array and sends the new board with updated groups array
    newBoardGroups.splice(source.index, 1)
    newBoardGroups.splice(destination.index, 0, newBoard.groups[source.index])
    newBoard.groups = newBoardGroups
    return newBoard

    // reorder tasks across the groups
  } else if (type === 'task') {
    const prevGroupIdx = newBoardGroups.findIndex((group) => group.id === source.droppableId)
    const newGroupIdx = newBoardGroups.findIndex((group) => group.id === destination.droppableId)
    const prevGroup = newBoardGroups[prevGroupIdx]
    const newGroup = newBoardGroups[newGroupIdx]

    // in case relocating task in the same group
    if (prevGroupIdx === newGroupIdx) {
      // in case the new task index is smaller
      if (destination.index < source.index) {
        newGroup.tasks.splice(destination.index, 0, newBoard.groups[prevGroupIdx].tasks[source.index])
        prevGroup.tasks.splice(source.index + 1, 1)

        // in case the new task index is bigger
      } else {
        newGroup.tasks.splice(destination.index + 1, 0, newBoard.groups[prevGroupIdx].tasks[source.index])
        prevGroup.tasks.splice(source.index, 1)
      }
      // in case new task location is on different group
    } else {
      newGroup.tasks.splice(destination.index, 0, newBoard.groups[prevGroupIdx].tasks[source.index])
      prevGroup.tasks.splice(source.index, 1)
    }

    newBoard.groups[newGroupIdx] = newGroup
    newBoard.groups[prevGroupIdx] = prevGroup
    return newBoard
  }
}
