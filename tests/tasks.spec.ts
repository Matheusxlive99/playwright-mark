import { expect, test } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskyByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'
import data from './fixtures/tasks.json'

let tasksPage: TasksPage

test.beforeEach(({page}) => {
    tasksPage = new TasksPage(page)
})

test.describe('cadastro', () => {

    test('deve poder cadastrar uma nova tarefa', async ({ request }) => {
        //Arrange
        const task = data.success as TaskModel
        await deleteTaskyByHelper(request, task.name)

        //Action
       
        await tasksPage.go()
        await tasksPage.create(task)

        //Assert
        await tasksPage.shouldHaveText(task.name)
        
    })

    test('não deve permitir tarefa duplicada', async ({ request }) => {
        //Arrange
        const task = data.duplicate as TaskModel
        await deleteTaskyByHelper(request, task.name)
        await postTask(request, task)

        //Action
        await tasksPage.go()
        await tasksPage.create(task)

        //Assert
        await tasksPage.alertHaveText('Task already exists!')

    })

    test('campo obrigatorio', async () => {
        //Arrange
        const task = data.required as TaskModel

        //Action
        await tasksPage.go()
        await tasksPage.create(task)

        //Assert
        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        await tasksPage.validationRequiredField('This is a required field')
    })

})

test.describe('atualização', () => {

    test('deve concluir uma tarefa', async ({ request }) => {
        //Arrange
        const task = data.update as TaskModel
        await deleteTaskyByHelper(request, task.name)
        await postTask(request, task)

        //Action
        await tasksPage.go()
        await tasksPage.toggle(task.name)

        //Assert
        await tasksPage.shouldBeDone(task.name)
    })

})

test.describe('exclusão', () => {

    test('deve excluir uma tarefa', async ({ request }) => {
        //Arrange
        const task = data.delete as TaskModel
        await deleteTaskyByHelper(request, task.name)
        await postTask(request, task)

        //Action
        await tasksPage.go()
        await tasksPage.removeTask(task.name)

        //Assert
        await tasksPage.shouldNotExist(task.name)
    })

})

