package com.bank_application.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bank_application.backend.entity.BankAccount;
import com.bank_application.backend.repository.BankAccountRepo;

@Service
public class BankAccountService {

    @Autowired
    private BankAccountRepo bankAccountRepo;

    // ✅ Add Bank Account
    public String addBankAccount(BankAccount bankAccount) {

        boolean exists = bankAccountRepo.existsByMobileNumberAndBankName(
                bankAccount.getMobileNumber(),
                bankAccount.getBankName()
        );

        if (exists) {
            throw new IllegalArgumentException("Bank already linked with this mobile number!");
        }

        bankAccountRepo.save(bankAccount);
        return "Bank account added successfully";
    }

    // ✅ Delete Bank Account
    public String deleteBankAccount(Long id) {

        if (!bankAccountRepo.existsById(id)) {
            throw new IllegalArgumentException("Bank account not found");
        }

        bankAccountRepo.deleteById(id);
        return "Bank account removed successfully";
    }
}