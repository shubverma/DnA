/* LICENSE START
 * 
 * MIT License
 * 
 * Copyright (c) 2019 Daimler TSS GmbH
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * LICENSE END 
 */

package com.daimler.data.service.itsmmgame;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daimler.data.assembler.ItsmmGameUserAssembler;
import com.daimler.data.db.entities.ItsmmGameUserDetailNsql;
import com.daimler.data.db.repo.itsmm.ItsmmGameUserCustomRepository;
import com.daimler.data.db.repo.itsmm.ItsmmGameUserRepository;
import com.daimler.data.dto.itsmmgame.ItsmmGameUserDetailsVO;
import com.daimler.data.dto.itsmmgame.ItsmmGameUserRecordsVO;
import com.daimler.data.dto.itsmmgame.ItsmmGameUserResultsWraperVO;
import com.daimler.data.service.common.BaseCommonService;

@Service
public class BaseItsmmGameUserService
        extends BaseCommonService<ItsmmGameUserDetailsVO, ItsmmGameUserDetailNsql, String>
        implements ItsmmGameUserService {

    @Autowired
    private ItsmmGameUserCustomRepository customRepo;
    @Autowired
    private ItsmmGameUserRepository jpaRepo;
    @Autowired
    private ItsmmGameUserAssembler algoAssembler;

    public BaseItsmmGameUserService() {
        super();
    }

	@Override
	public ItsmmGameUserResultsWraperVO getResults(String answer) {
		return customRepo.getResults(answer);
	}

	@Override
	public ItsmmGameUserRecordsVO getRecords() {
		return customRepo.getRecords();
	}

}
