package com.bank_application.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.bank_application.backend.entity.BankAccount;
import com.bank_application.backend.services.BankAccountService;
import com.bank_application.backend.repository.BankAccountRepo;

@RestController
@RequestMapping("/bank")
public class BankAccountController {

    @Autowired
    private BankAccountService bankAccountService;

    @Autowired
    private BankAccountRepo bankAccountRepo;

    // 1️ Add Bank Account
    @PostMapping("/add")
    public String addBankAccount(@RequestBody BankAccount bankAccount) {
        return bankAccountService.addBankAccount(bankAccount);
    }

    // 2️ Get all bank accounts using mobile number
    @GetMapping("/{mobileNumber}")
    public List<BankAccount> getAccounts(@PathVariable String mobileNumber) {
        return bankAccountRepo.findByMobileNumber(mobileNumber);
    }

    // 3️ Delete bank account
    @DeleteMapping("/{id}")
    public String deleteAccount(@PathVariable Long id) {
        return bankAccountService.deleteBankAccount(id);
    }
}