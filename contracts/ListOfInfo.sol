// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ListOfInfo {
  uint public taskCount = 0;
  struct Task{
    uint id;
    string content;
    bool completed;
  }

  mapping(uint=>Task) public tasks;

  constructor()public{
    createTask("By default Task");
  }

  function createTask(string memory content)public{
    taskCount++;
    tasks[taskCount] = Task(taskCount,content,false);
  }
 
}
