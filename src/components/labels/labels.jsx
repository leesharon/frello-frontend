import { GrFormEdit } from 'react-icons/gr'
import { useSelector, useDispatch } from 'react-redux'
import { updateTask } from '../../store/actions/task.action'
import { updateBoard } from '../../store/actions/board.action'
import React, { useEffect, useState } from 'react'
import { EditLabel } from './edit-label'
import { utilService } from '../../services/util.service'
import { taskService } from '../../services/task.service'

export const Labels = ({
  task,
  groupId,
  onToggleLabelEdit,
  isLabelsEdit,
  setQuickEdit,
}) => {
  const dispatch = useDispatch()
  let board = useSelector((state) => state.boardModule.board)
  board = structuredClone(board)
  // TODO check if you can bring labels from the board in line 13
  let boardLabelsStore = useSelector(
    (state) => state.boardModule.board.labels || []
  )

  const [selectedLabel, setSelectedLabel] = useState()
  const [labelsToDisplay, setLabelsToDisplay] = useState(boardLabelsStore)

  useEffect(() => {
    setLabelsToDisplay(boardLabelsStore)
    return () => {
      setSelectedLabel(null)
    }
  }, [boardLabelsStore, task])

  const handleChange = ({ target }, labelId) => {
    if (target.type === 'checkbox') {
      if (!task.labelIds) task.labelIds = []

      if (target.checked) task.labelIds.push(labelId)
      else task.labelIds.splice(task.labelIds.indexOf(labelId), 1)

      if (setQuickEdit) setQuickEdit((prevState) => ({ ...prevState, task }))
      dispatch(updateTask(groupId, task))
    } else if (target.type === 'text') {
      const regex = new RegExp(target.value, 'i')
      const filteredLabels = board.labels.filter((label) =>
        regex.test(label.title)
      )
      setLabelsToDisplay(filteredLabels)
    }
  }

  const onOpenSaveLabel = (ev, label) => {
    ev.preventDefault()
    if (label) setSelectedLabel(label)
    onToggleLabelEdit()
  }

  const onSaveLabel = (label) => {
    if (!board.labels) board.labels = []
    if (!task.labelIds) task.labelIds = []

    if (label.id)
      // Edit label
      board.labels.splice(board.labels.indexOf(label.id), 1, label)
    else {
      // Create label
      label.id = utilService.makeId()
      task.labelIds.push(label.id)
      board.labels.push(label)
      board = taskService.update(board, groupId, task)
    }

    if (setQuickEdit) setQuickEdit((prevState) => ({ ...prevState, task }))
    setSelectedLabel(null)
    dispatch(updateBoard(board))
  }

  const onRemoveLabel = (labelId) => {
    const labelsToSave = labelsToDisplay.filter(
      (currLabel) => currLabel.id !== labelId
    )
    board.labels = labelsToSave

    // Removes the labelId from all tasks across board
    const cleanBoard = taskService.removeLabelIdFromTasks(board, labelId)
    dispatch(updateBoard(cleanBoard))
  }
  return (
    <section className="labels">
      {isLabelsEdit ? (
        <EditLabel
          label={selectedLabel}
          onToggleLabelEdit={onToggleLabelEdit}
          onSaveLabel={onSaveLabel}
          onRemoveLabel={onRemoveLabel}
        />
      ) : (
        <React.Fragment>
          <div className="">
            <input
              onClick={(ev) => {
                ev.preventDefault()
              }}
              onChange={handleChange}
              autoFocus={window.innerWidth >= 1200}
              className="search-label"
              type="text"
              placeholder="Search labels…"
            />
          </div>
          <p className="sub-header">Labels</p>
          <ul>
            {labelsToDisplay.map((label) => (
              <li key={label.id}>
                <label htmlFor={label.id} className="checkbox-container">
                  <input
                    onChange={(ev) => {
                      handleChange(ev, label.id)
                    }}
                    checked={task.labelIds?.includes(label.id)}
                    className="checkbox"
                    type="checkbox"
                    id={label.id}
                  />
                  <span className="checkmark"></span>
                  <div className="label-container">
                    <div className={`label-color ${label.class}`}>
                      <div
                        className={`label-color-circle ${label.color}`}
                      ></div>
                      {label.title && (
                        <span className="label-title">{label.title}</span>
                      )}
                    </div>
                  </div>
                </label>
                <button
                  onClick={(ev) => {
                    onOpenSaveLabel(ev, label)
                  }}
                  className="edit"
                >
                  <GrFormEdit />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={(ev) => {
              onOpenSaveLabel(ev)
            }}
            className="create"
          >
            Create new label
          </button>
        </React.Fragment>
      )}
    </section>
  )
}
